'use client';

import React from 'react';
import { Button } from 'pakt-ui';
import { Briefcase, Edit } from 'lucide-react';
import { AfroProfile } from '@/components/common/afro-profile';
import { getAvatarColor } from '@/lib/utils';
import Link from 'next/link';

export const ProfileHeader = ({
  _id,
  name,
  position,
  score,
  skills,
  isLoggedIn,
}: {
  _id: string;
  name: string;
  position: string;
  score: number;
  skills: any[];
  isLoggedIn?: boolean;
}) => {
  const borderColor = getAvatarColor(score);
  return (
    <div className="w-full flex relative bg-white py-6 rounded-2xl gap-6 border border-line">
      <div className="absolute left-[5%] top-[0%] shrink-0">
        <AfroProfile score={Math.round(score)} size="lg">
          <div className="bg-white h-full w-full"></div>
        </AfroProfile>
      </div>
      <div className="flex flex-col gap-0 grow">
        <div
          className={`flex flex-row gap-2 px-6 w-full justify-between border-b pb-4`}
          style={{ borderColor: borderColor }}
        >
          <div className="w-1/5"></div>
          <div className="flex flex-row justify-between w-4/5">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-title">{name}</h1>
              <div className="flex gap-2 items-center text-body">
                <Briefcase size={16} />
                <span>{position}</span>
              </div>
            </div>

            {!isLoggedIn ? (
              <div className="flex gap-3 items-center max-w-[300px] w-full">
                <Link href={`/messages?userid=${_id}`}>
                  <Button fullWidth variant="secondary" size={'sm'}>
                    Message
                  </Button>
                </Link>
                <Button fullWidth variant="primary" size={'sm'}>
                  Invite to Job
                </Button>
              </div>
            ) : (
              <div className="flex flex-row justify-end items-center max-w-[300px] ml-auto w-full">
                <Link href={`/settings`}>
                  <Button fullWidth variant="secondary">
                    <span className="flex flex-row gap-2">
                      <Edit size={24} />
                      Edit Profile
                    </span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row px-6 py-2 min-h-[80px]">
          <div className="w-1/5"></div>
          <div className="flex w-4/5 flex-wrap gap-2 h-fit">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="bg-white rounded-full px-6 py-1.5 text-sm font-medium text-[#090A0A] capitalize"
                style={{ backgroundColor: skill.backgroundColor }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
