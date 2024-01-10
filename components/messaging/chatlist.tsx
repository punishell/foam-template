"use client";

import React from "react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserBalance } from "@/components/common/user-balance";
import { useMessaging } from "@/providers/socketProvider";
import { Spinner } from "../common";
import { AfroProfile } from "../common/afro-profile";

const ChatList = ({ conversations, loading }: { conversations: any[]; loading: boolean }) => {
    return (
        <div className="flex w-full grow flex-col divide-line overflow-y-auto border-t">
            {loading && <Spinner />}
            {conversations.map((c: any, i) => (
                <ChatListItem
                    key={i}
                    chatId={c?.id}
                    _id={c.sender?._id}
                    name={`${c?.sender?.firstName} ${c?.sender?.lastName}`}
                    avatar={c?.sender?.profileImage?.url}
                    score={c?.sender?.score}
                    unreadCount={c?.unreadcount}
                    lastMessage={c?.lastMessage ?? ""}
                    time={c?.lastMessageTime}
                />
            ))}
        </div>
    );
};

const ChatListSearch = () => {
    return (
        <div className="relative flex items-center gap-2 p-4 py-4">
            <div className="absolute left-6">
                <Search size={18} className="text-body" />
            </div>
            <input
                type="text"
                className="w-full resize-none rounded-lg border bg-gray-50 px-2 py-2 pl-8 focus:outline-none"
                placeholder="Search"
            />
        </div>
    );
};

interface ChatListItemProps {
    _id: string;
    name: string;
    avatar?: string;
    score?: number;
    time: string;
    chatId: string;
    lastMessage: string;
    unreadCount: number;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
    _id,
    name,
    avatar,
    score,
    unreadCount,
    lastMessage,
    time,
    chatId,
}) => {
    const pathname = usePathname();
    const urlChatId = pathname.split("/")[2];
    const isActiveChat = urlChatId === chatId;

    return (
        <Link href={`/messages/${chatId}`} className="border-b">
            <div
                className={`flex w-full items-center gap-2 border-l-4 px-3 py-3 duration-200 hover:bg-[#ECFCE5] ${
                    isActiveChat ? "border-primary bg-[#ECFCE5]" : "border-transparent bg-white"
                }`}
            >
                <AfroProfile score={score ?? 0} src={avatar} size="sm" url={`/talents/${_id}`} />
                <div className="flex grow flex-col">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="text-base font-medium text-title">{name}</div>
                            {unreadCount > 0 && (
                                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-gradient text-xs text-white text-opacity-80">
                                    {unreadCount}
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-body">{time}</div>
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-body">
                        {lastMessage && lastMessage.length > 30 ? lastMessage.slice(0, 30) + "..." : lastMessage}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export { ChatList, ChatListSearch };
