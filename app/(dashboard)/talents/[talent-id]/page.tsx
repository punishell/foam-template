'use client';

import React from 'react';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { useGetTalentById } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Achievements } from '@/components/talents/achievement';
import { Reviews } from '@/components/talents/review';
import { ProfileHeader } from '@/components/talents/header';

export default function TalentDetails() {
  const params = useParams();
  const talentId = String(params['talent-id']);
  const talentData = useGetTalentById(talentId, true);

  if (talentData.isLoading) return <PageLoading />;

  if (talentData.isError) return <PageError />;

  const talent = talentData.data.talent;

  return (
    <div className="flex flex-col gap-6 pt-6 overflow-y-auto">
      <ProfileHeader
        _id={talent._id}
        name={`${talent.firstName} ${talent.lastName}`}
        position={talent.profile.bio?.title ?? ''}
        score={talent.score}
        skills={talent?.profile?.talent?.tagsIds?.map((t) => ({ name: t.name, backgroundColor: t.color })) ?? []}
        profileImage={talent.profileImage?.url}
      />

      <div className="flex gap-6 w-full">
        <Bio body={talent.profile.bio?.description ?? ''} />
        <Achievements
          achievements={talentData.data.talent.achievements?.map(({ total, type, value }) => ({
            type,
            title: type,
            total: Number(total),
            value: Number(value),
          }))}
        />
      </div>
      <Reviews
        reviews={
          talent.achievements?.map((a) => ({
            title: a.type,
            type: a.type,
            total: Number(a.total),
            value: Number(a.value),
          })) ?? []
        }
        loading={talentData.isLoading}
      />
    </div>
  );
}

const Bio = ({ body }: { body: string }) => {
  return (
    <div className="flex flex-col grow-0 w-full bg-[#FFEFD7] p-4 rounded-4 gap-3 border border-yellow-dark rounded-2xl">
      <h3 className="text-left text-title text-lg font-medium">Bio</h3>
      <div>{body}</div>
    </div>
  );
};
