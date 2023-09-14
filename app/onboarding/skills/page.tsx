'use client';

import clsx from 'clsx';
import React from 'react';
import { Button } from 'pakt-ui';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/common';
import type { LucideIcon } from 'lucide-react';
import { useUpdateAccount } from '@/lib/api/account';
import { PenTool, Terminal, Users, Feather, Library, Volume2 } from 'lucide-react';

const SKILLS = [
  { label: 'Design', value: 'design', Icon: PenTool },
  { label: 'Engineering', value: 'engineering', Icon: Terminal },
  { label: 'Product', value: 'product', Icon: Library },
  { label: 'Marketing', value: 'marketing', Icon: Volume2 },
  { label: 'Copywriting', value: 'copywriting', Icon: Feather },
  { label: 'Others', value: 'others', Icon: Users },
];

export default function Skills() {
  const router = useRouter();
  const updateAccount = useUpdateAccount();
  const [selectedSkill, setSelectedSkill] = React.useState<string>('');

  const onSubmit = () => {
    updateAccount.mutate(
      {
        profile: {
          bio: {
            title: selectedSkill,
          },
        },
      },
      {
        onSuccess: () => {
          router.push('/onboarding/profile-picture');
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex flex-col text-left w-full gap-1">
        <p className="text-2xl">Great to meet you, Leslie.</p>
        <span className="text-4xl font-bold text-[#1f2739]">What are you interested in?</span>
      </div>
      <div className="mt-9 grid grid-cols-3 gap-6 w-full">
        {SKILLS.map(({ Icon, label, value }) => (
          <SkillCard
            key={value}
            label={label}
            Icon={Icon}
            isActive={selectedSkill === value}
            toggleSelection={() => {
              setSelectedSkill(value);
            }}
          />
        ))}
      </div>
      <div className="mx-auto max-w-xs w-full mt-2">
        <Button fullWidth disabled={!selectedSkill || updateAccount.isLoading} onClick={onSubmit}>
          {updateAccount.isLoading ? <Spinner /> : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

interface SkillCardProps {
  label: string;
  Icon: LucideIcon;
  isActive: boolean;
  toggleSelection: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ label, Icon, isActive, toggleSelection }) => {
  return (
    <button
      onClick={toggleSelection}
      className={clsx(
        'text-title flex flex-col min-w-[200px] items-start gap-4 rounded-lg border p-6 duration-200 hover:bg-gray-100',
        {
          'border-[#E8E8E8] bg-[#FCFCFC]': !isActive,
          'border-[#007C5B] bg-[#007C5B1A]': isActive,
        },
      )}
    >
      <Icon size={32} />
      <span className="text-2xl">{label}</span>
    </button>
  );
};
