'use client';
import React from 'react';
import { AfroProfile } from '@/components/common/afro-profile';
import { useUserState } from '@/lib/store/account';

export const UserProfile = () => {
  const account = useUserState();

  return (
    <div className="flex flex-col items-center gap-2">
      <AfroProfile score={account?.score ?? 0} size="2xl" src={account?.profileImage?.url} url={`/profile`} />

      <div className="flex flex-col gap-0 text-center">
        <span className="text-lg">
          {account?.firstName} {account?.lastName}
        </span>
        <span className="text-sky text-sm capitalize">{account?.profile?.bio?.title}</span>
      </div>
    </div>
  );
};
