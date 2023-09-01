'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { UserBalance } from '@/components/common/user-balance';
import { useMessaging } from '@/providers/socketProvider';
import { ChatList, ChatListSearch } from '@/components/messaging/chatlist';

interface Props {
  children: React.ReactNode;
}

export default function MessagesLayout({ children }: Props) {
  const { conversations } = useMessaging();
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div className="text-3xl text-title font-bold">Messages</div>

        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2 text-3xl text-title">
            <UserBalance />
            <span>|</span> <span className="text-body">Balance</span>
          </div>
          <button className="flex gap-2 items-center text-primary text-sm font-bold bg-[#008D6C1A] p-3 rounded-full">
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div className="flex grow w-full h-[90%]">
        <div className="bg-white basis-[370px] grow-0 border h-full shrink-0 flex flex-col rounded-lg rounded-r-none border-line">
          <ChatListSearch />
          <ChatList conversations={conversations} />
        </div>

        <div className="w-full border grow h-full bg-white flex flex-col rounded-lg rounded-l-none border-l-0 border-line p-6 pt-3">
          {children}
        </div>
      </div>
    </div>
  );
}
