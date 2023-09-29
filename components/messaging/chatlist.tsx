'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { UserBalance } from '@/components/common/user-balance';
import { useMessaging } from '@/providers/socketProvider';
import { Spinner } from '../common';
import { ProfileImage } from '../overview/ProfileImage';

const ChatList = ({ conversations, loading }: { conversations: any[], loading: boolean }) => {
  return (
    <div className="grow w-full overflow-y-auto flex flex-col divide-line">
      {loading && <Spinner />}
      {conversations.map((c: any, i) =>
        <ChatListItem
          key={i}
          chatId={c?.id}
          name={`${c?.sender?.firstName} ${c?.sender?.lastName}`}
          avatar={c?.sender?.profileImage?.url}
          unreadCount={c?.unreadcount}
          lastMessage={c?.lastMessage ?? ""}
          time={c?.lastMessageTime}
        />
      )}
    </div>
  );
};

const ChatListSearch = () => {
  return (
    <div className="flex relative items-center gap-2 p-4 py-6">
      <div className="absolute left-6">
        <Search size={18} className="text-body" />
      </div>
      <input
        type="text"
        className="border pl-8 focus:outline-none px-2 py-2 resize-none bg-gray-50 rounded-lg w-full"
        placeholder="Search"
      />
    </div>
  );
};

interface ChatListItemProps {
  name: string;
  avatar?: string;
  time: string;
  chatId: string;
  lastMessage: string;
  unreadCount: number;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ name, avatar, unreadCount, lastMessage, time, chatId }) => {
  const pathname = usePathname();
  const urlChatId = pathname.split('/')[2];
  const isActiveChat = urlChatId === chatId;

  return (
    <Link href={`/messages/${chatId}`} className="border-b">
      <div
        className={`flex w-full border-l-4 hover:bg-[#ECFCE5] duration-200 px-3 py-3 gap-2 items-center ${isActiveChat ? 'bg-[#ECFCE5] border-primary' : 'bg-white border-transparent'
          }`}
      >
        {/* <div className="h-10 w-10 shrink-0 rounded-full bg-slate-800"></div> */}
        <ProfileImage score={0} imageUrl={avatar} size='sm' />
        <div className="grow flex flex-col">
          <div className="flex justify-between gap-2 items-center">
            <div className="flex gap-2 items-center">
              <div className="text-title text-base font-medium">{name}</div>
              {unreadCount > 0 && <div className="h-4 w-4 shrink-0 text-white text-opacity-80 rounded-full text-xs bg-primary-gradient flex items-center justify-center">
                {unreadCount}
              </div>}
            </div>
            <div className="text-body text-xs">{time}</div>
          </div>
          <div className="text-body whitespace-nowrap text-sm text-ellipsis overflow-hidden">
            {lastMessage && lastMessage.length > 30 ? lastMessage.slice(0, 30) + '...' : lastMessage}
          </div>
        </div>
      </div>
    </Link>
  );
};

export { ChatList, ChatListSearch }