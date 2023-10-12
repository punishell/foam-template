'use client';

import React from 'react';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { useGetTalentById, useGetTalentReviewById } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Achievements } from '@/components/talents/achievement';
import { Reviews } from '@/components/talents/review';
import { ProfileHeader } from '@/components/talents/header';

export default function TalentDetails() {
  const params = useParams();
  const talentId = String(params['talent-id']);
  const talentData = useGetTalentById(talentId, true);
  const reviewData = useGetTalentReviewById(talentId, "1", "10", true);

  if (talentData.isLoading || (!talentData.isFetched && talentData.isFetching)) return <PageLoading />;

  if (talentData.isError) return <PageError />;

  const talent = talentData.data.talent;
  const reviews = reviewData.data;

  return (
    <div className="flex flex-col gap-6 pt-6 overflow-y-auto w-full">
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
            value: parseInt(value),
          }))}
        />
      </div>
      <div className='w-full'>
        <Reviews
          reviews={
            reviews?.data.map((a) => ({
              title: a.data.name,
              body: a.review,
              rating: a.rating,
              user: {
                _id: a.owner._id,
                afroScore: a.owner.score,
                name: `${a.owner.firstName}${a.owner.lastName}`,
                title: a.owner.profile.bio?.title || "",
                avatar: a.owner.profileImage?.url ?? "",
              }
            })) ?? []
          }
          loading={talentData.isLoading}
        />
      </div>
    </div>
  );
}

const Bio = ({ body }: { body: string }) => {
  return (
    <div className="flex flex-col grow-0 w-[60%] bg-[#FFEFD7] p-4 rounded-4 gap-3 border border-yellow-dark rounded-2xl">
      <h3 className="text-left text-title text-lg font-medium">Bio</h3>
      <div>{body}</div>
    </div>
  );
};