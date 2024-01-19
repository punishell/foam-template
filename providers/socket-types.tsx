/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Socket } from "socket.io-client";

interface Bio {
    title: string;
    description: string;
}

interface Profile {
    bio: Bio;
}

interface SocketData {
    status: string; // Consider using an enum if there are fixed possible values
}

interface ProfileImage {
    _id: string;
    url: string;
}

export interface RecipientProps {
    profile?: Profile;
    socket?: SocketData;
    _id?: string;
    firstName?: string;
    lastName?: string;
    score?: number;
    profileImage?: ProfileImage;
    user?: string;
}

export interface AttachmentsResponseProps {
    createdAt?: string;
    deletedAt?: string;
    name?: string;
    size?: string;
    status?: boolean;
    type?: string | undefined;
    updatedAt?: string;
    uploaded_by?: string;
    url?: string | undefined;
    _v?: number;
    _id?: string;
}
// export interface AttachmentProps {
//     file?: File;
//     url: string;
//     type: string;
//     name: string;
//     progress?: number;
//     createdAt?: string | Date; // Use `Date` if `createdAt` is a Date object
//     size: string;
// }

export interface AttachmentsProps {
    file: File;
    id: string;
    name: string;
    preview: string;
    size: string;
    type: string;
    progress?: number;
    createdAt?: string;
    url?: string | undefined;
}

export interface Message {
    _id?: string;
    user?: string;
    type?: string; // Consider using an enum for message types
    content: string;
    attachments: AttachmentsResponseProps[]; // Define a type for attachments if you have a structure for it
    seen?: string; // ISO date string, consider using Date type
    readBy?: string[];
    conversation?: string;
    createdAt?: string; // ISO date string, consider using Date type
    updatedAt?: string; // ISO date string, consider using Date type
    __v?: number;
}

export interface ConversationProps {
    _id?: string;
    type: string; // Consider using an enum for conversation types
    recipients: RecipientProps[];
    messages: Message[];
    createdAt: string; // ISO date string, consider using Date type
    updatedAt?: string; // ISO date string, consider using Date type
    __v?: number;
    title?: string;
    description?: string;
}

interface InitializeConversationProps {
    type: string;
    recipients: string[]; // Array of recipient IDs
    messages: Message[]; // Define a 'Message' type if you have a structure for messages
    _id: string;
    createdAt: string; // ISO date string, consider using Date type
    updatedAt: string; // ISO date string, consider using Date type
    __v: number;
}

// ===============================

export interface MessageProps {
    messages: ConversationProps[];
}

export interface PopUpMessageProps {
    messages: ConversationProps[];
    currentMessage?: Message | null | undefined;
    recipients: RecipientProps[];
    _id: string;
}

export interface InitializeMessageProps {
    conversation: InitializeConversationProps;
}

// ===============================

export interface SocketResponse<T> {
    data: T;
    error: boolean;
    message: string;
    statusCode: number;
}

/* -------------------------------------------------------------------------- */

export interface UserStatusProps {
    currentConversation: string;
    user: string;
}

export interface ParseMessagesProps {
    content?: string;
    isSent?: boolean;
    isRead?: boolean;
    attachments?: AttachmentsResponseProps[] | AttachmentsProps[];
    sending?: boolean;
}

export interface ParseUserChatProps {
    createdAt?: string;
    header?:
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
          };
    id?: string | undefined;
    lastMessage?: string | null;
    lastMessageTime?: string | null;
    messages?: ParseMessagesProps[];
    recipient?: RecipientProps | undefined;
    recipients?: RecipientProps[] | undefined;
    sender?: RecipientProps | undefined;
    type?: string;
    unreadcount: number;
}

export interface SocketContextType {
    currentConversation: ParseUserChatProps | null;
    loadingChats: boolean;
    status: string;
    conversations: ParseUserChatProps[];
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
        images: AttachmentsProps[],
    ) => Promise<void>;
    markUserMessageAsSeen: (conversation: string) => void;
    getConversationById: (id: string) => void;
    setActiveConversation: (id: string) => void;
    unreadChatCount: number;
}
