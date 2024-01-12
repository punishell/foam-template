"use client";

/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { getCookie } from "cookies-next";
import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";
import dayjs from "dayjs";

import { useUserState } from "@/lib/store/account";
import { AUTH_TOKEN_KEY, formatBytes } from "@/lib/utils";
import { toast } from "@/components/common/toaster";
import { type ImageUp } from "@/lib/types";
import { postUploadImages } from "@/lib/api/upload";

const MAX_RECONNECT_TIME = 1000;

export const MessageTypeEnums = {
    TEXT: "TEXT",
    MEDIA: "MEDIA",
};

export const conversationEnums = {
    USER_CONNECT: "USER_CONNECT",
    GET_ALL_CONVERSATIONS: "GET_ALL_CONVERSATIONS",
    JOIN_OLD_CONVERSATIONS: "JOIN_OLD_CONVERSATIIONS",
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

interface RecipientProps {
    _id?: string;
    firstName?: string;
    lastName?: string;
    profile?: {
        bio?: {
            title: string;
        };
    };
    profileImage?: {
        url: string;
    };
    score: number;
    title: string;
    description: string;
    avatar: string;
    user?: string;
}

interface ChatImageProps {
    size: string;
    type: string;
    name: string;
    url: string;
    _id: string;
    id?: string; // Optional
}

interface MessageProps {
    content: string;
    user?: string;
    readBy?: string[];
    attachments: ChatImageProps[];
    createdAt?: string;
    isSent?: boolean;
    isRead?: boolean;
    sending?: boolean;
}

interface ResponseDataProps {
    messages: ConversationProps[];
}

interface ConversationProps {
    _id?: string;
    id?: string; // Optional
    messages: MessageProps[];
    sender?: RecipientProps | undefined;
    recipient?: RecipientProps | undefined;
    recipients: RecipientProps[];
    createdAt: string;
    type: string;
    unreadcount?: number;
    lastMessage?: string | null;
    lastMessageTime?: string | null;
    title?: string | null;
    description?: string | null;
    header?: RecipientProps;
    currentMessage?: MessageProps | null | undefined;
}

export interface SocketContextType {
    currentConversation: ConversationProps | null;
    loadingChats: boolean;
    status: string;
    conversations: unknown[];
    socket: Socket | null;
    startingNewChat: boolean;
    fetchUserChats: () => void;
    startUserInitializeConversation: (recipientId: string) => Promise<void>;
    sendUserMessage: (
        sender: string,
        recipient: string,
        type: string,
        message: string,
        conversation: string,
        images: ImageUp[],
    ) => Promise<void>;
    markUserMessageAsSeen: (conversation: string) => Promise<void>;
    getConversationById: (id: string) => Promise<void>;
    setActiveConversation: (id: string) => void;
    unreadChatCount: number;
}

interface DataProps {
    currentConversation: string;
    user: string;
    score: number;
    title: string;
    description: string;
    avatar: string;
}

const MIN_LEN = 25;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const SocketContext = createContext<SocketContextType>({
    currentConversation: null,
    loadingChats: true,
    status: "pending",
    conversations: [],
    socket: null,
    startingNewChat: false,
    fetchUserChats: () => {},
    startUserInitializeConversation: async () => Promise.resolve(),
    sendUserMessage: async () => Promise.resolve(),
    markUserMessageAsSeen: async () => Promise.resolve(),
    getConversationById: async () => Promise.resolve(),
    setActiveConversation: async () => {},
    unreadChatCount: 0,
});

interface SocketResponse<T> {
    error: boolean;
    statusCode: number;
    message: string;
    data: T;
}

const prefix = "messaging";

export const MessagingProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
    const authToken = getCookie(AUTH_TOKEN_KEY);
    const { _id: loggedInUser } = useUserState();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [currentConversation, setCurrentConversation] = useState<ConversationProps | null>(null);
    const [conversations, setConversations] = useState<unknown[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [status, setStatus] = useState<string>("pending");
    const [loadingChats, setLoadingChats] = useState<boolean>(true);
    const [socketReconnect, setSocketReconnect] = useState<boolean>(false);
    const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
    const [startingNewChat, setStartingNewChat] = useState(false);
    const router = useRouter();
    const initiated = useRef(false);

    const pathname = usePathname();
    const messagingScreen = pathname.includes(prefix);

    const parseMessageAttachments = (attachments: ChatImageProps[]): ChatImageProps[] =>
        attachments && attachments.length > 0
            ? attachments.map((a) => ({
                  size: formatBytes(Number(a.size), 0),
                  type: a.type,
                  name: a.name,
                  url: a.url,
                  _id: a._id,
              }))
            : [];

    const parseMessages = (messages: MessageProps[]): MessageProps[] =>
        messages.map((m: MessageProps) => ({
            content: m.content,
            isSent: m.user === loggedInUser,
            isRead: !!m.readBy?.includes(loggedInUser as string),
            attachments: parseMessageAttachments(m.attachments),
        }));

    const getSender = (recipients: RecipientProps[] = []): RecipientProps | undefined => {
        return recipients.find((r: RecipientProps) => r._id !== loggedInUser);
    };
    const getRecipient = (recipients: RecipientProps[] = []): RecipientProps | undefined => {
        return recipients.find((r: RecipientProps) => r._id === loggedInUser);
    };

    const getConversationHeader = (conversation: ConversationProps): RecipientProps => {
        const sender = conversation.recipients.find((r: RecipientProps) => r._id !== loggedInUser);
        return conversation.type === "DIRECT"
            ? {
                  _id: sender?._id,
                  title: `${sender?.firstName} ${sender?.lastName}`,
                  description: sender?.profile?.bio?.title ?? "",
                  avatar: sender?.profileImage?.url ?? "",
                  score: sender?.score ?? 0,
              }
            : {
                  title: conversation?.title as string,
                  description: conversation?.description as string,
                  score: 0,
                  avatar: "",
              };
    };

    const getUnreadCount = (messages: MessageProps[]): number =>
        messages.filter(
            (r: MessageProps) => !(r.readBy && !!r.readBy.includes(loggedInUser as string)) && r.user !== loggedInUser,
        ).length;

    const getLastMessage = (messages: MessageProps[]): string | null => {
        const lastMessage = messages[messages.length - 1];
        return lastMessage ? lastMessage.content : null;
    };

    const getLastMessageTime = (messages: MessageProps[]): string | null => {
        const lastMessage = messages[messages.length - 1];
        return lastMessage ? dayjs(lastMessage.createdAt).format("HH:ss A") : null;
    };

    const parseUserChats = (payload: ConversationProps[]): ConversationProps[] =>
        payload.map((c: ConversationProps) => ({
            id: c._id,
            messages: parseMessages(c.messages ?? []),
            sender: getSender(c.recipients ?? []),
            recipient: getRecipient(c.recipients ?? []),
            recipients: c.recipients,
            header: getConversationHeader(c),
            createdAt: dayjs(c.createdAt).format("MMMM D, YYYY"),
            type: c.type,
            unreadcount: getUnreadCount(c.messages ?? []),
            lastMessage: getLastMessage(c.messages ?? []),
            lastMessageTime: getLastMessageTime(c.messages ?? []),
        }));

    const setUnreadChats = (convo: ConversationProps[]): void => {
        const unread = convo.reduce((a: number, b: ConversationProps) => a + (b.unreadcount ?? 0), 0);
        setUnreadChatCount(unread);
    };

    const SocketConnection = async (): Promise<void> => {
        if (socket && loggedInUser && !initiated.current) {
            initiated.current = true;
            socket.on("connect", function onConnect() {
                setSocket(socket);
                socket.emit(
                    conversationEnums.USER_CONNECT,
                    { userId: loggedInUser },
                    (response: SocketResponse<ResponseDataProps>) => {
                        if (!response.error) {
                            const parsedConversation = parseUserChats(response.data.messages);
                            setConversations(parsedConversation);
                            setLoadingChats(false);
                            setUnreadChats(parsedConversation);
                        }
                    },
                );

                // Join Old Conversation If any
                socket?.emit(conversationEnums.JOIN_OLD_CONVERSATIONS, { userId: loggedInUser }, () => {});
                socket?.on("disconnect", () => {
                    // TODO:: Perform Disconnect Function
                });

                // notifies if user status is either offline/ online in an active chat
                socket?.on(conversationEnums.USER_STATUS, function onUserStatus(data: DataProps) {
                    if (currentConversation && currentConversation._id === data.currentConversation) {
                        if (Array.isArray(currentConversation.recipients)) {
                            const updatedRecipients = currentConversation.recipients.map((r) => {
                                if (typeof r === "string" && r === data.user) return data;
                                if (typeof r === "object" && r.user === data.user) return data;
                                return r;
                            });
                            currentConversation.recipients = updatedRecipients;
                        }
                    }
                });
            });
            // return () => socket?.off();
        }
    };

    const fetchUserChats = async (currentConversationId?: string): Promise<void> => {
        if (socket) {
            socket.emit(
                conversationEnums.GET_ALL_CONVERSATIONS,
                { userId: loggedInUser },
                (response: SocketResponse<ResponseDataProps>) => {
                    if (!response.error) {
                        const payload = response?.data?.messages;
                        const parsedConversation = parseUserChats(payload);
                        setConversations(parsedConversation);
                        setLoadingChats(false);
                        setUnreadChats(parsedConversation);
                        if (currentConversationId) {
                            const cOV = parsedConversation.find(
                                (c: ConversationProps) => c.id === currentConversationId,
                            );
                            setCurrentConversation(cOV ?? null);
                        }
                        // @ts-expect-error --- Type error
                        return payload.messages;
                    }
                },
            );
        }
    };

    const Reconnect = (): void => {
        setTimeout(() => {
            setSocketReconnect(true);
        }, MAX_RECONNECT_TIME);
    };

    const connectChatInit = async (): Promise<void> => {
        const isSocketConnected = socket?.connected;

        if (loggedInUser && !isSocketConnected && authToken) {
            try {
                const newSocket = io(SOCKET_URL as string, {
                    extraHeaders: {
                        authorization: `Bearer ${authToken}`,
                    },
                });

                setSocket(newSocket);
                setSocketReconnect(false);
            } catch (error: unknown) {
                // console.log("socket--er", error);
                Reconnect();
            }
        } else {
            Reconnect();
        }
    };

    useEffect(() => {
        // Here we listen to popup events
        socket?.on(conversationEnums.POPUP_MESSAGE, async (response: SocketResponse<ConversationProps>) => {
            const c = response.data;
            if (c.currentMessage) {
                const messageContent =
                    c.currentMessage.content?.length > MIN_LEN
                        ? `${c.currentMessage.content.slice(0, MIN_LEN)}...`
                        : c.currentMessage.content;
                if (messageContent) {
                    await fetchUserChats(c._id);
                    // notify user
                    const messageSender = c.recipients.find((r: RecipientProps) => r._id !== loggedInUser);
                    if (messageSender) {
                        const messageTitle = `${messageSender.firstName} ${messageSender.lastName}`;
                        const senderImage = messageSender?.profileImage?.url;
                        const senderScore = messageSender?.score ?? 0;
                        const senderId = messageSender._id as string;
                        // show toast if not on messaging screen
                        if (!messagingScreen) {
                            toast.message(messageTitle, messageContent, senderId, senderImage, senderScore);
                        }
                    }
                }
            }
        });

        return () => {
            socket?.off(conversationEnums.POPUP_MESSAGE);
        };
    }, [socket]);

    // listen to notification to broadcast to app
    useEffect(() => {
        void SocketConnection();
    }, [socket]);

    // connect to chat socket
    useEffect(() => {
        void connectChatInit();
    }, [loggedInUser]);

    useEffect(() => {
        if (socketReconnect) {
            void connectChatInit();
        }
    }, [socketReconnect]);

    const getConversationById = (id: string) => conversations.find((c: any) => c.id == id);

    const setActiveConversation = (_id: string) => {
        const conversation = getConversationById(_id);
        setCurrentConversation(conversation);
    };

    const startUserInitializeConversation = async (recipientId: string) => {
        try {
            setStartingNewChat(true);
            return socket.emit(
                conversationEnums.INITIALIZE_CONVERSATION,
                {
                    senderId: loggedInUser,
                    recipientId,
                    type: "DIRECT",
                },
                async (response: SocketResponse<any>) => {
                    if (response.error) {
                        toast.error(response.message);
                        router.push("/messages");
                        return;
                    }
                    const { conversation } = response.data;
                    await fetchUserChats(conversation._id);
                    setStartingNewChat(false);
                    if (conversation.error) {
                        router.back();
                        return;
                    }
                    router.push(`/messages/${conversation._id}`);
                },
            );
        } catch (error) {
            return null;
        }
    };

    const UploadFiles = async (images: ImageUp[]): Promise<string[]> => {
        const uploadFll: Array<{ file: File; onProgress: (progress: number) => void }> = [];
        const updateProgress = (id: string, progress: number): void => {
            // set upload progress for images
            if (currentConversation) {
                const currentMessage = currentConversation.messages?.find((m: MessageProps) => !!m.sending);
                if (currentMessage) {
                    // update progress with value
                    const currentImage = currentMessage.attachments.find((img: ChatImageProps) => img.id === id);

                    if (currentImage) {
                        // update progress
                        const imgData = { ...currentImage, progress };
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const newImages = [...currentMessage.attachments, imgData];
                    }
                }
            }
        };
        // create
        for (let i = 0; i < images.length; i++) {
            const em = images[i];
            const callbackFunc = (progress: number) => {
                updateProgress(em.id, progress);
            };
            uploadFll.push({
                file: em.file,
                onProgress: callbackFunc,
            });
        }
        const resp = await postUploadImages(uploadFll);
        return resp.map((r: any) => r._id);
    };

    const markUserMessageAsSeen = async (conversation: string): Promise<void> => {
        try {
            if (socket) {
                socket.emit(conversationEnums.MARK_MESSAGE_AS_SEEN, {
                    conversationId: conversation,
                    recipientId: loggedInUser,
                    seen: new Date(),
                });
            }
            await fetchUserChats();
        } catch (e) {
            return null;
        }
    };

    const sendUserMessage = async (
        sender: string,
        recipient: string,
        type = MessageTypeEnums.TEXT,
        message: string,
        conversation: string,
        images: ImageUp[],
    ) => {
        let attachments: string[] = [];
        try {
            await markUserMessageAsSeen(conversation);
            const currentConversation = getConversationById(conversation);
            setCurrentConversation({
                ...currentConversation,
                messages: [
                    ...currentConversation.messages,
                    { content: message, isSent: true, sending: true, attachments: images },
                ],
            });
            if (images.length > 0) {
                // perform image Uploads first before sending message
                attachments = await UploadFiles(images);
            }
            return socket.emit(
                conversationEnums.SEND_MESSAGE,
                {
                    senderId: sender,
                    recipientId: recipient,
                    type,
                    message,
                    conversationId: conversation,
                    attachments,
                },
                async (_response: any) => {
                    const currentConversationId = currentConversation.id;
                    await fetchUserChats(currentConversationId);
                },
            );
        } catch (error: any) {
            return toast.error(error?.response?.data.message || "Failed to Send Message Try again");
        }
    };

    const SocketServer: SocketContextType = {
        currentConversation,
        loadingChats,
        status,
        conversations,
        socket,
        unreadChatCount,
        startingNewChat,
        fetchUserChats,
        startUserInitializeConversation,
        sendUserMessage,
        markUserMessageAsSeen,
        getConversationById,
        setActiveConversation,
    };

    return <SocketContext.Provider value={{ ...SocketServer }}>{children}</SocketContext.Provider>;
};

export const useMessaging = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error("useSocket must be use inside SocketProvider");
    return context;
};
