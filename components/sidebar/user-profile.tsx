'use client';

import React from 'react';
import ContentLoader from 'react-content-loader';
import { UserAvatar } from '@/components/common/user-avatar';

interface Props {
  name: string;
  title?: string;
  paktScore?: number;
}

export const UserProfile = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <UserAvatar score={75} />

      <div className="flex flex-col gap-0 text-center">
        <span className="text-lg">Leslie Alexander</span>
        <span className="text-sky text-sm">Product Designer</span>
      </div>
    </div>
  );
};
