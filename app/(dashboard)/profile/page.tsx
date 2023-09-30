'use client';

import React, { useEffect, useMemo } from 'react';
import { Button } from 'pakt-ui';
import { Briefcase } from 'lucide-react';
import { UserAvatar } from '@/components/common/user-avatar';
import { useGetTalentById, useGetTalentReviewById } from '@/lib/api';
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
  const user = useUserState();
  const talentId = String(user?._id);
  const { data: talentReviews, refetch: FetchTalent, isFetched, isFetching } = useGetTalentReviewById(talentId, "1", "10");

  useEffect(() => {
    if (talentId) {
      FetchTalent();
    } else router.back();
  }, []);

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
    <div className="flex flex-col gap-6 pt-6 overflow-y-auto">
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
        <Achievements achievements={talent.achievements} />
      </div>
      <Reviews
        reviews={
          reviews?.map((a) => ({
            title: a.data.name,
            body: a.review,
            rating: a.rating,
            user: {
              afroScore: a.owner.score,
              name: `${a.owner.firstName}${a.owner.lastName}`,
              title: a.owner.profile.bio?.title || "",
              avatar: a.owner.profileImage?.url ?? "",
            }
          })) ?? []
        } loading={!isFetched && isFetching} />
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
