'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Slider } from 'pakt-ui';
import { Modal } from '@/components/common';
import { Spinner } from '@/components/common';
import { TagInput } from '@/components/common/tag-input';
import { UserAvatar } from '@/components/common/user-avatar';
import { useGetConnectionPreference, useUpdateConnectionPreference } from '@/lib/api/connection';
import { Bell, Search, Settings2, XCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { UserBalance } from '@/components/common/user-balance';

interface Props {
  children: React.ReactNode;
}

export default function MessagesLayout({ children }: Props) {
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl text-title font-bold">Messages</span>

          <button onClick={() => setSettingsModalOpen(true)}>
            <Settings2 size={24} className="text-title" />
          </button>

          <Modal isOpen={settingsModalOpen} onOpenChange={setSettingsModalOpen} className="max-w-xl">
            <SettingsModal />
          </Modal>
        </div>

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

      <div className="h-full flex grow w-full">
        <div className="bg-white basis-[370px] grow-0 border h-full shrink-0 flex flex-col rounded-lg rounded-r-none border-line">
          <ChatListSearch />
          <ChatList />
        </div>

        <div className="w-full border grow h-full bg-white flex flex-col rounded-lg rounded-l-none border-l-0 border-line p-6 pt-3">
          {children}
        </div>
      </div>
    </div>
  );
}

const SettingsModal = () => {
  const connectionPreference = useGetConnectionPreference();
  const updateConnectionPreference = useUpdateConnectionPreference();

  const [skills, setSkills] = React.useState<string[]>(connectionPreference.data?.skills ?? []);
  const [minimumScore, setMinimumScore] = React.useState(connectionPreference.data?.minimumScore ?? 0);
  const [minimumSkills, setMinimumSkills] = React.useState(connectionPreference.data?.minimumSkills ?? 0);

  const handleMinimumScoreChange = (value: number[]) => {
    setMinimumScore(value[0]);
  };

  const handleMinimumSkillsChange = (value: number[]) => {
    setMinimumSkills(value[0]);
  };

  return (
    <div className="bg-white p-4 rounded-md flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">Connection Preference Filter</div>
          <XCircle size={24} className="text-body" />
        </div>
        <span className="text-body">Set the criteria for the AfroFund users who can message you.</span>
      </div>

      <div className="bg-[#F9FFF6] p-4 pb-8 rounded-lg border-[#23C16B] border flex gap-4">
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-lg font-bold">Afroscore</h3>
            <span className="text-body text-sm">
              Set minimum talent AfroScore required to message you by dragging the slider
            </span>
          </div>

          <Slider
            value={[minimumScore]}
            onValueChange={handleMinimumScoreChange}
            min={0}
            max={100}
            thumbLabel={minimumScore.toString()}
          />
        </div>
        <div>
          <UserAvatar size="sm" score={minimumScore} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-bold">Set Skills</h3>
          <span className="text-body">Select up to 10 skills. Users will need at least one to reach out.</span>
        </div>
        <TagInput tags={skills} setTags={setSkills} className="min-h-[125px] items-start" />
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <div>
          <h3 className="text-body">Set minimum number of these skills a talent must have to message you</h3>
        </div>
        <Slider
          min={0}
          max={10}
          value={[minimumSkills]}
          thumbLabel={minimumSkills.toString()}
          onValueChange={handleMinimumSkillsChange}
        />
      </div>

      <Button
        fullWidth
        onClick={() => {
          updateConnectionPreference.mutate({
            skills,
            minimumScore,
            minimumSkills,
          });
        }}
      >
        {updateConnectionPreference.isLoading ? <Spinner /> : 'Set Preferences'}
      </Button>
    </div>
  );
};

const ChatList = () => {
  return (
    <div className="grow w-full overflow-y-auto flex flex-col divide-line">
      <ChatListItem
        chatId="1"
        name="Leslie Ola"
        unreadCount={3}
        lastMessage="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        time="12:00 PM"
      />
      <ChatListItem
        chatId="2"
        name="Leslie Ola"
        unreadCount={3}
        lastMessage="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        time="12:00 PM"
      />
      <ChatListItem
        chatId="3"
        name="Leslie Ola"
        unreadCount={3}
        lastMessage="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        time="12:00 PM"
      />
      <ChatListItem
        chatId="4"
        name="Leslie Ola"
        unreadCount={3}
        lastMessage="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        time="12:00 PM"
      />
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
  time: string;
  chatId: string;
  lastMessage: string;
  unreadCount: number;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ name, unreadCount, lastMessage, time, chatId }) => {
  const pathname = usePathname();
  const urlChatId = pathname.split('/')[2];
  const isActiveChat = urlChatId === chatId;

  return (
    <Link href={`/messages/${chatId}`} className="border-b">
      <div
        className={`flex w-full border-l-4 hover:bg-[#ECFCE5] duration-200 px-3 py-3 gap-2 items-center ${
          isActiveChat ? 'bg-[#ECFCE5] border-primary' : 'bg-white border-transparent'
        }`}
      >
        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-800"></div>
        <div className="grow flex flex-col">
          <div className="flex justify-between gap-2 items-center">
            <div className="flex gap-2 items-center">
              <div className="text-title text-base font-medium">{name}</div>
              <div className="h-4 w-4 shrink-0 text-white text-opacity-80 rounded-full text-xs bg-primary-gradient flex items-center justify-center">
                {unreadCount}
              </div>
            </div>
            <div className="text-body text-xs">{time}</div>
          </div>
          <div className="text-body whitespace-nowrap text-sm text-ellipsis overflow-hidden">
            {lastMessage.length > 30 ? lastMessage.slice(0, 30) + '...' : lastMessage}
          </div>
        </div>
      </div>
    </Link>
  );
};
