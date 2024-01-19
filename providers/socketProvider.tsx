"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { getCookie } from "cookies-next";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";
import dayjs from "dayjs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";
import { AUTH_TOKEN_KEY, formatBytes } from "@/lib/utils";
import { toast } from "@/components/common/toaster";
import { postUploadImages } from "@/lib/api/upload";
import { useErrorService } from "@/lib/store/error-service";
import {
    type SocketResponse,
    type ConversationProps,
    type MessageProps,
    type RecipientProps,
    type SocketContextType,
    type UserStatusProps,
    type Message,
    type ParseMessagesProps,
    type AttachmentsProps,
    type ParseUserChatProps,
    type PopUpMessageProps,
    type InitializeMessageProps,
    type AttachmentsResponseProps,
} from "./socket-types";

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

const MIN_LEN = 25;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

const defaultContext: SocketContextType = {
    currentConversation: null,
    loadingChats: true,
    status: "pending",
    conversations: [
        {
            createdAt: new Date().toISOString(),
            header:
                {
                    _id: "",
                    title: "",
                    description: "",
                    avatar: "",
                    score: 0,
                } || "",
            id: "",
            lastMessage: "",
            lastMessageTime: "",
            messages: [
                {
                    content: "",
                    isSent: false,
                    isRead: false,
                    attachments: [],
                },
            ],
            recipient: {
                profile: {
                    bio: {
                        title: "",
                        description: "",
                    },
                },
                socket: {
                    status: "",
                },
                _id: "",
                firstName: "",
                lastName: "",
                score: 0,
                profileImage: {
                    _id: "",
                    url: "",
                },
            },
            recipients: [
                {
                    profile: {
                        bio: {
                            title: "",
                            description: "",
                        },
                    },
                    socket: {
                        status: "",
                    },
                    _id: "",
                    firstName: "",
                    lastName: "",
                    score: 0,
                    profileImage: {
                        _id: "",
                        url: "",
                    },
                },
            ],
            sender: {
                profile: {
                    bio: {
                        title: "",
                        description: "",
                    },
                },
                socket: {
                    status: "",
                },
                _id: "",
                firstName: "",
                lastName: "",
                score: 0,
                profileImage: {
                    _id: "",
                    url: "",
                },
            },
            type: "",
            unreadcount: 0,
        },
    ] as ParseUserChatProps[],
    socket: null,
    startingNewChat: false,
    fetchUserChats: () => {},
    startUserInitializeConversation: async () => Promise.resolve(),
    sendUserMessage: async () => Promise.resolve(),
    markUserMessageAsSeen: async () => {},
    getConversationById: async () => {},
    setActiveConversation: async () => {},
    unreadChatCount: 0,
};

export const SocketContext = createContext<SocketContextType>(defaultContext);

const prefix = "messaging";

export const MessagingProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
    const authToken = getCookie(AUTH_TOKEN_KEY);
    const [socket, setSocket] = useState<Socket | null>(null);

    const [socketReconnect, setSocketReconnect] = useState<boolean>(false);

    const { _id: loggedInUser } = useUserState();

    const [currentConversation, setCurrentConversation] = useState<ParseUserChatProps | null>(null);
    const [conversations, setConversations] = useState<ParseUserChatProps[]>([]);

    // @ts-expect-error --- Unused variable
    const [status, setStatus] = useState<string>("pending");
    const [loadingChats, setLoadingChats] = useState<boolean>(true);
    const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
    const [startingNewChat, setStartingNewChat] = useState(false);

    const router = useRouter();
    const initiated = useRef(false);

    const pathname = usePathname();
    const messagingScreen = pathname.includes(prefix);

    const { setErrorMessage } = useErrorService();

    const getSender = (recipients: RecipientProps[] = []): RecipientProps | undefined => {
        return recipients.find((r: RecipientProps) => r._id !== loggedInUser);
    };
    const getRecipient = (recipients: RecipientProps[] = []): RecipientProps | undefined => {
        return recipients.find((r: RecipientProps) => r._id === loggedInUser);
    };

    const getUnreadCount = (messages: Message[]): number =>
        messages.filter((r: Message) => !(r.readBy && !!r.readBy.includes(loggedInUser)) && r.user !== loggedInUser)
            .length;

    const getLastMessage = (messages: Message[]): string | null => {
        const lastMessage = messages[messages.length - 1];
        return lastMessage ? lastMessage.content : null;
    };

    const getLastMessageTime = (messages: Message[]): string | null => {
        const lastMessage = messages[messages.length - 1];
        return lastMessage ? dayjs(lastMessage.createdAt).format("HH:ss A") : null;
    };

    const setUnreadChats = (convo: ParseUserChatProps[]): void => {
        const unread = convo?.reduce((a, b) => a + b.unreadcount, 0);
        setUnreadChatCount(unread);
    };

    const getConversationById = useCallback(
        (id: string): ParseUserChatProps | undefined => {
            const convo = conversations.find((c: ParseUserChatProps) => c.id === id);
            return convo;
        },
        [conversations],
    );

    const setActiveConversation = useCallback(
        (_id: string): void => {
            const conversation = getConversationById(_id);
            setCurrentConversation(conversation ?? null);
        },
        [getConversationById],
    );

    const parseMessageAttachments = (attachments: AttachmentsResponseProps[]): AttachmentsResponseProps[] =>
        attachments && attachments.length > 0
            ? attachments.map((a) => ({
                  size: formatBytes(Number(a.size), 0),
                  type: a.type,
                  name: a.name,
                  url: a.url,
              }))
            : [];

    const parseMessages = (messages: Message[]): ParseMessagesProps[] =>
        messages.map((m: Message) => ({
            content: m.content,
            isSent: m.user === loggedInUser,
            isRead: !!m.readBy?.includes(loggedInUser),
            attachments: parseMessageAttachments(m.attachments),
        }));

    const getConversationHeader = (
        conversation: ConversationProps,
    ):
        | {
              _id: string | undefined;
              title: string;
              description: string;
              avatar: string;
              score: number;
          }
        | {
              title: string | undefined;
              description: string | undefined;
              score: number;
              avatar: string;
              _id?: undefined;
          } => {
        const sender = conversation.recipients?.find((r: RecipientProps) => r._id !== loggedInUser);
        return conversation.type === "DIRECT"
            ? {
                  _id: sender?._id,
                  title: `${sender?.firstName} ${sender?.lastName}`,
                  description: sender?.profile?.bio?.title ?? "",
                  avatar: sender?.profileImage?.url ?? "",
                  score: sender?.score ?? 0,
              }
            : {
                  title: conversation.title,
                  description: conversation.description,
                  score: 0,
                  avatar: "",
              };
    };

    const parseUserChats = useCallback(
        (payload: ConversationProps[]) =>
            payload.map(
                (c: ConversationProps): ParseUserChatProps => ({
                    id: c._id,
                    messages: parseMessages(c.messages),
                    sender: getSender(c.recipients),
                    recipient: getRecipient(c.recipients),
                    recipients: c.recipients,
                    header: getConversationHeader(c),
                    createdAt: dayjs(c.createdAt).format("MMMM D, YYYY"),
                    type: c.type,
                    unreadcount: getUnreadCount(c.messages),
                    lastMessage: getLastMessage(c.messages),
                    lastMessageTime: getLastMessageTime(c.messages),
                }),
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const fetchUserChats = useCallback(
        async (currentConversationId?: string): Promise<void> => {
            if (!socket) {
                return;
            }
            socket.emit(
                conversationEnums.GET_ALL_CONVERSATIONS,
                { userId: loggedInUser },
                (response: SocketResponse<MessageProps>) => {
                    if (!response.error) {
                        const payload: ConversationProps[] = response?.data?.messages;
                        const parsedConversation = parseUserChats(payload);
                        setConversations(parsedConversation);
                        setLoadingChats(false);
                        setUnreadChats(parsedConversation);
                        if (currentConversationId) {
                            const cOV = parsedConversation.find(
                                (c: ParseUserChatProps) => c.id === currentConversationId,
                            );
                            setCurrentConversation(cOV ?? null);
                        }
                        return payload.map((c: ConversationProps) => c.messages);
                    }
                    return null;
                },
            );
        },
        [loggedInUser, parseUserChats, socket],
    );

    const startUserInitializeConversation = useCallback(
        async (recipientId: string): Promise<void> => {
            try {
                setStartingNewChat(true);
                if (!socket) {
                    setErrorMessage({
                        title: "Socket Connection Error (startUserInitializeConversation Function)",
                        message: "Socket is null",
                    });
                    return;
                }
                socket.emit(
                    conversationEnums.INITIALIZE_CONVERSATION,
                    {
                        senderId: loggedInUser,
                        recipientId,
                        type: "DIRECT",
                    },
                    async (response: SocketResponse<InitializeMessageProps>) => {
                        if (response.error) {
                            toast.error(response.message);
                            router.push("/messages");
                            return;
                        }
                        const { conversation } = response.data;
                        await fetchUserChats(conversation._id);
                        setStartingNewChat(false);
                        if (response.error) {
                            router.back();
                            return;
                        }
                        router.push(`/messages/${conversation._id}`);
                    },
                );
            } catch (error) {
                setErrorMessage({
                    title: "Socket Connection Error (startUserInitializeConversation Function)",
                    message: error,
                });
            }
        },
        [fetchUserChats, loggedInUser, router, setErrorMessage, socket],
    );

    const UploadFiles = useCallback(async (images: AttachmentsProps[]): Promise<string[]> => {
        const uploadFll: Array<{ file: File; onProgress: (progress: number) => void }> = [];
        const currentMessage = currentConversation?.messages
            ? currentConversation.messages.find((m: ParseMessagesProps) => !!m.sending)
            : null;
        const updateProgress = (id: string, progress: number): void => {
            // set upload progress for images
            if (currentMessage) {
                // update progress with value
                const currentImage = currentMessage?.attachments?.find(
                    (img: AttachmentsResponseProps) => img._id === id,
                );
                if (currentImage) {
                    const imgData = { ...currentImage, progress };
                    currentMessage.attachments = [
                        ...(currentMessage.attachments as AttachmentsResponseProps[]),
                        imgData,
                    ];
                }
            }
        };
        // create
        for (let i = 0; i < images.length; i++) {
            const em = images[i];
            if (em) {
                const callbackFunc = (progress: number): void => {
                    updateProgress(em.id, progress);
                };
                uploadFll.push({
                    file: em.file,
                    onProgress: callbackFunc,
                });
            }
        }
        const resp = await postUploadImages(uploadFll);
        return resp.map((r: AttachmentsResponseProps) => {
            return r._id as string;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const markUserMessageAsSeen = useCallback(
        async (conversation: string): Promise<null> => {
            try {
                if (!socket) {
                    setErrorMessage({
                        title: "Socket Connection Error (markUserMessageAsSeen Function)",
                        message: "Socket is null",
                    });
                    return null;
                }
                socket.emit(conversationEnums.MARK_MESSAGE_AS_SEEN, {
                    conversationId: conversation,
                    recipientId: loggedInUser,
                    seen: new Date(),
                });
                await fetchUserChats();
                return null;
            } catch (e) {
                return null;
            }
        },
        [fetchUserChats, loggedInUser, setErrorMessage, socket],
    );

    const sendUserMessage = useCallback(
        async (
            sender: string,
            recipient: string,
            // eslint-disable-next-line @typescript-eslint/default-param-last
            type: string = MessageTypeEnums.TEXT,
            message: string,
            conversation: string,
            images: AttachmentsProps[],
        ): Promise<void> => {
            let attachments: string[] = [];
            try {
                await markUserMessageAsSeen(conversation);
                const currentConv = getConversationById(conversation);

                if (!currentConv) {
                    // Handle the case where currentConv is undefined
                    return undefined;
                }

                setCurrentConversation({
                    ...currentConv,
                    messages: [
                        ...(currentConv.messages ?? []),
                        { content: message, isSent: true, sending: true, attachments: images },
                    ],
                });
                if (images.length > 0) {
                    // perform image Uploads first before sending message
                    attachments = await UploadFiles(images);
                }
                if (!socket) {
                    setErrorMessage({
                        title: "Socket Connection Error (markUserMessageAsSeen Function)",
                        message: "Socket is null",
                    });
                    return;
                }
                socket.emit(
                    conversationEnums.SEND_MESSAGE,
                    {
                        senderId: sender,
                        recipientId: recipient,
                        type,
                        message,
                        conversationId: conversation,
                        attachments,
                    },
                    async () => {
                        const currentConversationId = currentConversation?.id;
                        await fetchUserChats(currentConversationId);
                    },
                );
            } catch (error) {
                // @ts-expect-error --- TODO: Fix this
                toast.error(error?.response?.data.message ?? "Failed to Send Message Try again");
            }
        },
        [
            UploadFiles,
            currentConversation?.id,
            fetchUserChats,
            getConversationById,
            markUserMessageAsSeen,
            setErrorMessage,
            socket,
        ],
    );

    // LISTEN TO POPUP EVENTS
    useEffect(() => {
        // Here we listen to popup events
        socket?.on(conversationEnums.POPUP_MESSAGE, async (response: SocketResponse<PopUpMessageProps>) => {
            const c = response.data;
            if (c.currentMessage) {
                const messageContent =
                    c.currentMessage.content?.length > MIN_LEN
                        ? `${c.currentMessage.content.slice(0, MIN_LEN)}...`
                        : c.currentMessage.content;
                if (messageContent) {
                    await fetchUserChats(c._id);
                    // notify user
                    const messageSender = c.recipients?.find((r: RecipientProps) => r._id !== loggedInUser);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    // =========== Establish Connection to the WebSocket Server =========== //

    const SocketConnection = async (): Promise<(() => void) | null> => {
        if (socket && loggedInUser && !initiated.current) {
            initiated.current = true;
            socket.on("connect", () => {
                setSocket(socket);
                socket.emit(
                    conversationEnums.USER_CONNECT,
                    { userId: loggedInUser },
                    (response: SocketResponse<MessageProps>) => {
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
                socket?.on(conversationEnums.USER_STATUS, (data: UserStatusProps) => {
                    if (currentConversation && currentConversation.id === data.currentConversation) {
                        if (Array.isArray(currentConversation.recipients)) {
                            const updatedRecipients = currentConversation.recipients.map((r: RecipientProps) => {
                                if (typeof r === "string" && r === data.user) return data;
                                if (typeof r === "object" && r.user === data.user) return data;
                                return r;
                            });
                            currentConversation.recipients = updatedRecipients;
                        }
                    }
                });
            });
            return () => socket?.off();
        }
        return null;
    };

    // listen to notification to broadcast to app
    useEffect(() => {
        void SocketConnection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

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
                        "authorization": `Bearer ${authToken}`,
                    },
                });
                setSocket(newSocket);
                setSocketReconnect(false);
            } catch (error: unknown) {
                setErrorMessage({
                    title: "Socket Connection Error (connectChatInit Function)",
                    message: error,
                });
                Reconnect();
            }
        } else {
            Reconnect();
        }
    };

    // connect to chat socket
    useEffect(() => {
        void connectChatInit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedInUser]);

    // reconnect to chat socket
    useEffect(() => {
        if (socketReconnect) {
            void connectChatInit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketReconnect]);

    const SocketServer: SocketContextType = useMemo(
        () => ({
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
        }),
        [
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
        ],
    );

    return <SocketContext.Provider value={SocketServer}>{children}</SocketContext.Provider>;
};

export const useMessaging = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) throw new Error("useSocket must be use inside SocketProvider");
    return context;
};
