'use client';

import React, { useEffect, useMemo } from 'react';
import { Button } from 'pakt-ui';
import { Briefcase } from 'lucide-react';
import { UserAvatar } from '@/components/common/user-avatar';
import { useGetTalentById } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Achievements } from '@/components/talents/achievement';
import { Reviews } from '@/components/talents/review';
import { Spinner } from '@/components/common';
import { getAvatarColor } from '@/lib/utils';
import { useUserState } from '@/lib/store/account';
import Link from 'next/link';
import { ProfileHeader } from '@/components/talents/header';

export default function Profile() {
  const router = useRouter();
  const { _id: loggedInUser } = useUserState();
  const talentId = String(loggedInUser);
  const { data: talentData, refetch: FetchTalent, isFetched, isFetching } = useGetTalentById(talentId);

  useEffect(() => {
    if (talentId) {
      FetchTalent();
    } else router.back();
  }, []);

  const talent = useMemo(() => ({
    id: talentData?.talent?.data.data?._id,
    name: `${talentData?.talent?.data.data.firstName} ${talentData?.talent?.data.data.lastName}`,
    positon: talentData?.talent?.data.data?.profile?.bio?.title,
    bio: talentData?.talent?.data.data.profile?.bio?.description,
    score: talentData?.talent?.data.data?.score,
    achievements: talentData?.talent?.data.data?.achievements.map((a: any) => ({ title: a.type, type: a.type, total: a.total, value: a.value })),
    skills: talentData?.talent?.data?.data?.profile?.talent?.tags || [],
    reviews: talentData?.review?.data?.data?.data,
  }), [talentData]);

  if (!isFetched && isFetching) {
    return <div className="flex h-full w-full my-auto items-center justify-center z-20"><Spinner /></div>
  }

  return (
    <div className="flex flex-col gap-6 pt-6 overflow-y-auto">
      <ProfileHeader _id={talent.id} name={talent.name} position={talent.positon} score={talent.score} skills={talent.skills} />

      <div className="flex gap-6">
        <Bio body={talent.bio} />
        <Achievements achievements={talent.achievements} />
      </div>
      <Reviews reviews={talent.reviews} />
    </div>
  );
}


const Bio = ({ body }: { body: string }) => {
  return (
    <div className="flex flex-col grow bg-[#FFEFD7] p-4 rounded-4 gap-3 border border-yellow-dark rounded-2xl">
      <h3 className="text-left text-title text-lg font-medium">Bio</h3>
      <div>{body}</div>
    </div>
  );
};
