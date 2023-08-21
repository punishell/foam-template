'use client';

import React from 'react';
import ContentLoader from 'react-content-loader';
import { UserAvatar } from '@/components/common/user-avatar';
import { useUserState } from '@/lib/store/account';

interface Props {
  name: string;
  title?: string;
  paktScore?: number;
}

export const UserProfile = () => {
  const { firstName, lastName, profile, profileImage } = useUserState();
  return (
    <div className="flex flex-col items-center gap-2">
      <UserAvatar score={75} image={profileImage?.url} />

      <div className="flex flex-col gap-0 text-center">
        <span className="text-lg">{firstName} {lastName}</span>
        <span className="text-sky text-sm">{profile?.bio?.title}</span>
      </div>
    </div>
  );
};
