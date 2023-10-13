'use client';

import React, { useEffect, useMemo } from 'react';
import { useGetTalentReviewById } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Achievements } from '@/components/talents/achievement';
import { Reviews } from '@/components/talents/review';
import { useUserState } from '@/lib/store/account';
import { ProfileHeader } from '@/components/talents/header';
import { Bio } from '@/components/talents/bio';

export default function Profile() {
  const router = useRouter();
  const user = useUserState();
  const talentId = String(user?._id);
  const { data: talentReviews, isLoading, refetch: FetchTalent } = useGetTalentReviewById(talentId, "1", "10", true);

  useEffect(() => {
    if (talentId) {
      FetchTalent();
    } else router.back();
  }, [user]);

  const talent = useMemo(
    () => ({
      id: user?._id,
      name: `${user?.firstName} ${user?.lastName}`,
      position: user?.profile?.bio?.title || '',
      image: user?.profileImage?.url || '',
      bio: user?.profile?.bio?.description || '',
      score: user?.score || 0,
      achievements: (user?.achievements || []).map((a) => ({
        title: a.type,
        type: a.type,
        total: Number(a.total),
        value: Number(a.value),
      })),
      skills: (user?.profile?.talent?.tagsIds || []).map((t) => ({ name: t.name, backgroundColor: t.color })) || [],
    }),
    [user],
  );
  const reviews = talentReviews?.data || [];
  return (
    <div className="flex flex-col gap-6 pt-6 overflow-y-auto w-full">
      <ProfileHeader
        _id={talent.id}
        name={talent.name}
        position={talent.position}
        score={talent.score}
        skills={talent.skills}
        isOwnProfile={true}
        profileImage={talent.image}
      />

      <div className="flex gap-6 w-full">
        <Bio body={talent.bio} />
        <Achievements
          achievements={talent.achievements?.map(({ total, type, value }) => ({
            type,
            title: type,
            total: Number(total),
            value: parseInt(String(value)),
          }))}
        />
      </div>
      <div className='w-full'>
        <Reviews
          reviews={
            talentReviews?.data?.map((a) => ({
              title: a.data.name,
              body: a.review,
              rating: a.rating,
              user: {
                _id: a._id,
                afroScore: a.owner.score,
                name: `${a.owner.firstName}${a.owner.lastName}`,
                title: a.owner.profile.bio?.title || "",
                avatar: a.owner.profileImage?.url ?? "",
              }
            })) ?? []
          } loading={isLoading} />
      </div>
    </div>
  );
}