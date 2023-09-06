'use client';

import React from 'react';
// import ContentLoader from 'react-content-loader';
import { UserAvatar } from '@/components/common/user-avatar';
import { useGetAccount } from '@/lib/api/account';

interface Props {
  name: string;
  title?: string;
  paktScore?: number;
}

export const UserProfile = () => {
  const { data } = useGetAccount();
  return (
    <div className="flex flex-col items-center gap-2">
      <UserAvatar score={75} image={data?.profileImage?.url} />

      <div className="flex flex-col gap-0 text-center">
        <span className="text-lg">{data?.firstName} {data?.lastName}</span>
        <span className="text-sky text-sm">{data?.profile?.bio?.title}</span>
      </div>
    </div>
  );
};
