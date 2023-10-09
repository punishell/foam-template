'use client';
import React from 'react';
import Image from 'next/image';
import { useGetAccount } from '@/lib/api/account';
import { AfroScore } from '@/components/common/afro-profile';
import { ProfileImage } from '../overview/ProfileImage';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_TO_PX: Record<Size, number> = {
  sm: 60,
  md: 110,
  lg: 150,
  xl: 180,
};

interface Props {
  name: string;
  title?: string;
  paktScore?: number;
}

export const UserProfile = () => {
  const data = useGetAccount();

  if (data.isLoading) return null;

  const account = data.data;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* <AfroProfile score={account?.score ?? 0} size="xl">
        <div className="h-full w-full rounded-full">
          {account?.profileImage?.url ? (
            <Image width={SIZE_TO_PX['xl']} height={SIZE_TO_PX["xl"]} src={account?.profileImage.url} alt="profile" className="p-2 rounded-full" />
          ) : (
            <DefaultAvatar />
          )}
        </div>
      </AfroProfile> */}
      <ProfileImage score={account?.score ?? 0} size="xl" imageUrl={account?.profileImage?.url} />

      <div className="flex flex-col gap-0 text-center">
        <span className="text-lg">
          {account?.firstName} {account?.lastName}
        </span>
        <span className="text-sky text-sm capitalize">{account?.profile?.bio?.title}</span>
      </div>
    </div>
  );
};

const DefaultAvatar = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 144 144">
      <circle cx="71.789" cy="71.789" r="71.789" fill="#89FFDD"></circle>
      <mask
        id="mask0_1_272"
        style={{ maskType: 'alpha' }}
        width="144"
        height="144"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <circle cx="71.789" cy="71.789" r="71.789" fill="#C4C4C4"></circle>
      </mask>
      <g mask="url(#mask0_1_272)">
        <ellipse cx="71.789" cy="126.349" fill="#007367" rx="54.56" ry="31.587"></ellipse>
      </g>
      <circle cx="71.789" cy="61.021" r="25.844" fill="#007367"></circle>
    </svg>
  );
};
