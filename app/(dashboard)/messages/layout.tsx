'use client';

import React from 'react';
import { Button, Slider } from 'pakt-ui';
import { Modal } from '@/components/common';
import { Spinner } from '@/components/common';
import { TagInput } from '@/components/common/tag-input';
import { AfroScore } from '@/components/common/afro-profile';
import { useGetConnectionPreference, useUpdateConnectionPreference } from '@/lib/api/connection';
import { XCircle, Settings } from 'lucide-react';
import { UserBalance } from '@/components/common/user-balance';
import { useMessaging } from '@/providers/socketProvider';
import { ChatList, ChatListSearch } from '@/components/messaging/chatlist';

interface Props {
  children: React.ReactNode;
}

export default function MessagesLayout({ children }: Props) {
  // const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const { conversations, loadingChats } = useMessaging();

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Modal isOpen={settingsModalOpen} onOpenChange={setSettingsModalOpen} className="max-w-xl">
            <SettingsModal />
          </Modal>
        </div>
      </div> */}

      <div className="flex grow w-full mb-4">
        <div className="bg-white basis-[370px] grow-0 border h-full shrink-0 flex flex-col rounded-lg rounded-r-none border-line">
          <ChatListSearch />
          {/* <div className="flex relative items-center gap-2 px-4 pb-6">
            <Button variant={'outline'} className="!px-4 !py-2" onClick={() => setSettingsModalOpen(true)}>
              <span className="flex flex-row text-sm font-bold items-center">
                Set Connection Preference <Settings className="ml-2" size={16} />
              </span>
            </Button>
          </div> */}
          <ChatList conversations={conversations} loading={loadingChats} />
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
          <AfroScore size="sm" score={minimumScore} />
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
