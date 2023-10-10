'use client';
import React from 'react';
import { useGetAccount } from '@/lib/api/account';
import { AfroProfile } from '@/components/common/afro-profile';

export const UserProfile = () => {
  const data = useGetAccount();

  if (data.isLoading) return null;

  const account = data.data;

  return (
    <div className="flex flex-col items-center gap-2">
      <AfroProfile score={account?.score ?? 0} size="2xl" src={account?.profileImage?.url} />

      <div className="flex flex-col gap-0 text-center">
        <span className="text-lg">
          {account?.firstName} {account?.lastName}
        </span>
        <span className="text-sky text-sm capitalize">{account?.profile?.bio?.title}</span>
      </div>
    </div>
  );
};
