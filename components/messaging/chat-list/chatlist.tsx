"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "../../common";
import { ChatListItem } from "./chat-list-item";

interface ProfileImage {
    url: string;
}

interface Sender {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: ProfileImage;
    score?: number;
}

interface Conversation {
    id: string;
    sender?: Sender;
    unreadcount?: number;
    lastMessage?: string;
    lastMessageTime?: string | Date; // Use Date if it's a Date object
}

interface ChatListProps {
    conversations: Conversation[];
    loading: boolean;
}

export const ChatList = ({ conversations, loading }: ChatListProps): ReactElement => {
    return (
        <div className="flex w-full grow flex-col divide-line overflow-y-auto border-t">
            {loading && <Spinner />}
            {conversations.map((c: Conversation, i: number) => (
                <ChatListItem
                    key={i}
                    chatId={c?.id}
                    _id={c.sender?._id as string}
                    name={`${c?.sender?.firstName} ${c?.sender?.lastName}`}
                    avatar={c?.sender?.profileImage?.url}
                    score={c?.sender?.score}
                    unreadCount={c?.unreadcount as number}
                    lastMessage={c?.lastMessage ?? ""}
                    time={c?.lastMessageTime as string}
                />
            ))}
        </div>
    );
};
