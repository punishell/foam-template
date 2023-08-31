'use client';
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { sendToast } from "@/components/messaging/notify";
// import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUserState } from "@/lib/store/account";
import { COOKIE_NAME } from "@/lib/utils";
import { axios } from "@/lib/axios";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";

export const MessageTypeEnums = {
  TEXT: "TEXT",
  MEDIA: "MEDIA",
};

export const conversationEnums = {
  USER_CONNECT: "USER_CONNECT",
  GET_ALL_CONVERSATIONS: "GET_ALL_CONVERSATIONS",
  JOIN_OLD_CONVERSATIIONS: "JOIN_OLD_CONVERSATIIONS",
  GET_ALL_USERS: "GET_ALL_USERS",
  INITIALIZE_CONVERSATION: "INITIALIZE_CONVERSATION",
  FETCH_CONVERSATION_MESSAGES: "FETCH_CONVERSATION_MESSAGES",
  SEND_MESSAGE: "SEND_MESSAGE",
  CURRENT_RECIPIENT: "CURRENT_RECIPIENT",
  USER_TYPING: "USER_TYPING",
  SENDER_IS_TYPING: "SENDER_IS_TYPING",
  SENDER_STOPS_TYPING: "SENDER_STOPS_TYPING",
  POPUP_MESSAGE: "POPUP_MESSAGE",
  MARK_MESSAGE_AS_SEEN: "MARK_MESSAGE_AS_SEEN",
  USER_STATUS: "USER_STATUS",
};

export type SocketContextType = {
  currentConversation: Object | any;
  loadingChats: boolean;
  status: string;
  conversations: any;
  socket: Socket | any;
  fetchUserChats: () => any;
  startUserInitializeConversation: (
    sender: string,
    recipient: object
  ) => Promise<any>;
  sendUserMessage: (
    sender: string,
    recipient: string,
    type: string,
    message: string,
    conversation: string
  ) => Promise<any>;
  markUserMessageAsSeen: (
    conversation: string,
    sender: string,
    recipient: string
  ) => Promise<any>;
  getConversationById: (id: string) => Promise<any>;
  setActiveConversation: (id: string) => void;
};
const MIN_LEN = 25;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const SocketContext = createContext<SocketContextType>(
  {} as SocketContextType
);

const prefix = "messaging";
export const MessagingProvider = ({ children }: { children: React.ReactNode }) => {
  const authToken = getCookie(COOKIE_NAME);
  const { _id } = useUserState();
  const loggedInUser = _id;
  const [socket, setSocket] = useState<Socket | null | any>(null);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [conversations, setConversations] = useState<any>([]);
  const [status, setStatus] = useState<string>("pending");
  const [loadingChats, setLoadingChats] = useState<boolean>(true);

  const pathname = usePathname();
  const messagingScreen = pathname.includes(prefix);

  const SocketConnection = async () => {
    if (socket && loggedInUser) {
      socket.on("connect", function () {
        console.log(socket);
        setSocket(socket);
        socket.emit(conversationEnums.USER_CONNECT, { userId: loggedInUser }, (response: any) => {
          const parsedConversation = parseUserchats(response);
          setConversations(parsedConversation);
          setLoadingChats(false);
        });

        // Join Old Conversation If any
        socket?.emit(conversationEnums.JOIN_OLD_CONVERSATIIONS, { userId: loggedInUser }, () => { });
        socket?.on("disconnect", () => {
          console.log("has disconnected==", socket);
        });

        // notifies if user status is either offline/ online in an active chat
        socket?.on(conversationEnums.USER_STATUS, function (data: any) {
          if (currentConversation && currentConversation._id === data.currentConversation) {
            if (Array.isArray(currentConversation.recipients)) {
              const updatedRecipients = currentConversation.recipients.map((r: any) => {
                if (typeof r === "string" && r === data.user) return data;
                else if (typeof r === "object" && r.user === data.user) return data;
                return r;
              });
              currentConversation.recipients = updatedRecipients;
            }
          }
        });
      });
      return () => socket?.off();
    }
  };

  useEffect(() => {
    // Here we listen to popup events
    socket?.on(conversationEnums.POPUP_MESSAGE, (c: any) => {
      console.log("new message===", c)
      // notify user
      const messageContent =
        c.currentMessage.content.length > MIN_LEN
          ? c.currentMessage.content.slice(0, MIN_LEN) + "..."
          : c.currentMessage.content;
      const messageSender = c.recipients.find(
        (r: any) => r._id != loggedInUser
      );
      const messageTitle =
        messageSender.firstName + "" + messageSender.lastName;
      const senderImage = messageSender?.profileImage?.url;
      // show toast if not on messsaging screen
      if (!messagingScreen) {
        return sendToast(messageTitle, messageContent, senderImage);
      }
    });

    return () => {
      socket?.off(conversationEnums.POPUP_MESSAGE);
    };
  }, [socket]);

  // listen to notification to broadcast to app
  useEffect(() => {
    SocketConnection();
  }, [socket]);

  // connect to chat socket
  useEffect(() => {
    connectChatInit();
  }, []);

  const connectChatInit = async () => {
    if (loggedInUser) {
      try {
        const newSocket = io(SOCKET_URL as string, {
          extraHeaders: {
            "authorization": "Bearer " + authToken,
          },
        });
        return setSocket(newSocket);
      } catch (error: any) {
        return null;
      }
    }
  };

  const getSender = (recipients = []) => recipients.find((r: any) => r._id != loggedInUser);
  const getRecipient = (recipients = []) => recipients.find((r: any) => r._id == loggedInUser);

  const getConversationHeader = (conversation: any) => {
    const sender = conversation.recipients.find((r: any) => r._id !== loggedInUser);
    return conversation.type == "DIRECT" ? { title: `${sender.firstName} ${sender.lastName}`, description: sender?.profile?.bio?.title } : { title: conversation.title, description: conversation.description };
  };
  const getUnreadcount = (messages: any[]) => messages.filter((r: any) => r.seen == null).length;
  const getLastMessage = (messages: any[]) => messages.length > 0 ? messages[0].content : null;
  const getLastMessageTime = (messages: any[]) => messages.length > 0 ? dayjs(messages[0].createdAt).format("HH:ss A") : null;
  const getConversationById = (id: string) => conversations.find((c: any) => c.id == id);
  const parseMessages = (messages: []) => messages.map((m:any) => ({
    content: m.content,
    isSent: m.user == loggedInUser,
  }))

  const setActiveConversation = (_id: string) => {
    const conversation = getConversationById(_id);
    return setCurrentConversation(conversation);
  }

  const parseUserchats = (payload: any[]) => payload.map((c: any) => ({
    id: c._id,
    messages: parseMessages(c.messages),
    sender: getSender(c.recipients),
    recipient: getRecipient(c.recipients),
    recipients: c.recipients,
    header: getConversationHeader(c),
    createdAt: dayjs(c.createdAt).format("MMMM D, YYYY"),
    type: c.type,
    unreadcount: getUnreadcount(c.messages),
    lastMessage: getLastMessage(c.messages),
    lastMessageTime: getLastMessageTime(c.messages),
  })
  );

  const fetchUserChats = async () => {
    try {
      const { data } = await axios.get(`/chat`);
      if (data?.status === "success") {
        const payload = data?.data;
        const parsedConversation = parseUserchats(payload);
        setConversations(parsedConversation);
        setLoadingChats(false);
        return payload.messages;
      }
    } catch (error: any) {
      return error?.response?.data;
    }
  };

  const startUserInitializeConversation = async (
    sender: string,
    recipient: object
  ) => {
    // return dispatch(startInitializeConversation({ socket, sender, recipient }));
    try {
      await socket.emit(
        conversationEnums.INITIALIZE_CONVERSATION,
        {
          senderId: sender,
          recipientId: (recipient as any)._id,
        },
        async (conversation: any) => {
          return conversation;
        }
      );
    } catch (error) {
      return null;
    }
  };

  const sendUserMessage = async (
    sender: string,
    recipient: string,
    type = MessageTypeEnums.TEXT,
    message: string,
    conversation: string
  ) => {
    try {
      const sentMessage = await socket.emit(
        conversationEnums.SEND_MESSAGE,
        {
          senderId: sender,
          recipientId: recipient,
          type,
          message,
          conversationId: conversation,
        },
        (conversation: any) => {
          return conversation;
        }
      );
      fetchUserChats();
      return sentMessage;
    } catch (error: any) {
      // return error?.response?.data;
      console.log("sending0---error", error);
    }
  };

  const markUserMessageAsSeen = async (
    conversation: string,
    sender: string,
    recipient: string
  ) => {
    // return markMessageAsSeen({ socket, conversation, sender, recipient });
    try {
      await socket.emit(conversationEnums.MARK_MESSAGE_AS_SEEN, {
        conversationId: conversation,
        senderId: sender,
        recipientId: (recipient as any)._id,
        seen: new Date(),
      }, async function (conversations: any) {
        return { recipient, conversations };
      });
    } catch (e) {
      return null;
    }
  };

  const SocketServer: SocketContextType = {
    currentConversation,
    loadingChats,
    // loadingMessages,
    status,
    conversations,
    socket,
    fetchUserChats,
    startUserInitializeConversation,
    sendUserMessage,
    markUserMessageAsSeen,
    getConversationById,
    setActiveConversation,
  };

  return (
    <SocketContext.Provider value={{ ...SocketServer }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be use inside SocketProvider");
  return context;
};

