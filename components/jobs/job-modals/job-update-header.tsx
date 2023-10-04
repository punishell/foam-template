import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { AfroProfile } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';
import type { UserProfile } from '@/lib/types';

interface Props {
  createdAt: string;
  deliveryDate: string;
  paymentFee: number;
  progress: number;
  profile: UserProfile;
  tags: {
    color: string;
    name: string;
  }[];
}

export const JobUpdateHeader: React.FC<Props> = ({ createdAt, profile, deliveryDate, paymentFee, progress, tags }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="border bg-[#F8FFF4] border-[#7DDE86] p-4 rounded-2xl grid grid-cols-4 divide-x">
        <div className="pr-4 flex flex-col gap-2">
          <span className="text-body">Date Created</span>
          <span>{format(new Date(createdAt), 'MMM dd, yyyy')}</span>
        </div>
        <div className="px-4 flex flex-col gap-2">
          <span className="text-body">Due Date</span>
          <span>{format(new Date(deliveryDate), 'MMM dd, yyyy')}</span>
        </div>

        <div className="px-4 flex flex-col gap-2">
          <span className="text-body">Price</span>
          <span>{paymentFee} USD</span>
        </div>
        <div className="pl-4 flex flex-col gap-2">
          <span className="text-body">Status</span>
          <span className="px-3 py-1 text-sm text-white inline-flex rounded-full bg-[#4CD471] w-fit">
            {progress === 100 ? 'Completed' : 'In Progress'}
          </span>
        </div>
      </div>

      <div className="border bg-[#F8FFF4] border-[#7DDE86] p-4 rounded-2xl flex flex-col divide-y">
        <div className="pb-4 flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <AfroProfile score={profile.score} size="sm">
              <div className="h-full w-full rounded-full">
                {profile.profileImage?.url ? (
                  <Image src={profile.profileImage?.url} fill alt="profile" className="rounded-full" />
                ) : (
                  <DefaultAvatar />
                )}
              </div>
            </AfroProfile>
            <div className="flex flex-col">
              <span className="text-title text-base font-bold">{`
                  ${profile.firstName} ${profile.lastName}
                  `}</span>
              <span className="text-sm capitalize">{profile.profile.bio.title}</span>
            </div>
          </div>
        </div>
        <div className="pt-4 flex items-center gap-2">
          <span className="text-body">Skills</span>
          <div className="flex items-center gap-2 text-sm">
            {tags.map(({ color, name }) => {
              return (
                <span
                  key={name}
                  className={`px-4 capitalize rounded-full py-0.5`}
                  style={{
                    backgroundColor: color,
                  }}
                >
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
