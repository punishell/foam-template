'use client';

import React, { useEffect, useMemo } from 'react';
import { Button } from 'pakt-ui';
import { Briefcase } from 'lucide-react';
import { UserAvatar } from '@/components/common/user-avatar';
import { useGetTalentById } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { Achievements } from '@/components/talents/achievement';
import { Reviews } from '@/components/talents/review';
import { Spinner } from '@/components/common';

export default function TalentDetails() {
  const params = useParams();
  const router = useRouter();
  const talentId = String(params["talent-id"]);
  const { data: talentData, refetch: FetchTalent, isFetched, isFetching } = useGetTalentById(talentId);

  useEffect(() => {
    if (talentId) {
      FetchTalent();
    } else router.back();
  }, []);

  const talent = useMemo(() => ({
    name: `${talentData?.talent?.data.data.firstName} ${talentData?.talent?.data.data.lastName}`,
    positon: talentData?.talent?.data.data?.profile?.bio?.title,
    bio: talentData?.talent?.data.data.profile?.bio?.description,
    score: talentData?.talent?.data.data?.score,
    achievements: talentData?.talent?.data.data?.achievements.map((a: any) => ({ title: a.type, type: a.type, total: a.total, value: a.value })),
    skills: talentData?.talent?.data.data.profile.talent.tags,
    reviews: talentData?.review?.data?.data?.data,
  }), [talentData]);

  if (!isFetched && isFetching) {
    return <div className="flex h-full w-full my-auto items-center justify-center z-20"><Spinner /></div>
  }

  return (
    <div className="flex flex-col gap-6 pt-6 overflow-y-auto">
      <Header name={talent.name} position={talent.positon} score={talent.score} skills={SKILLS} />

      <div className="flex gap-6">
        <Bio body={talent.bio} />
        <Achievements achievements={talent.achievements} />
      </div>
      <Reviews reviews={talent.reviews} />
    </div>
  );
}

const Header = ({ name, position, score, skills }: { name: string, position: string, score: number, skills: any[] }) => {
  return (
    <div className="w-full flex relative bg-white py-6 rounded-2xl gap-6 border border-line">
      <div className="absolute left-[5%] top-[10%]  shrink-0">
        <UserAvatar score={score} size="md" />
      </div>
      <div className="flex flex-col gap-4 grow">
        <div className="flex flex-row gap-2 px-6 w-full justify-between border-b pb-4">
          <div className='w-1/5'></div>
          <div className='flex flex-row justify-between w-4/5'>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-title">{name}</h1>
              <div className="flex gap-2 items-center text-body">
                <Briefcase size={16} />
                <span>{position}</span>
              </div>
            </div>

            <div className="flex gap-3 items-center max-w-[300px] w-full">
              <Button fullWidth variant="secondary" size={'sm'}>
                Message
              </Button>
              <Button fullWidth variant="primary" size={'sm'}>
                Invite to Job
              </Button>
            </div>
          </div>
        </div>
        <div className='flex flex-row px-6'>
          <div className='w-1/5'></div>
          <div className="flex w-4/5 flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="bg-white rounded-full px-6 py-1.5 text-sm font-medium text-[#090A0A]" style={{ backgroundColor: skill.backgroundColor }}>{skill.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SKILLS = [
  {
    name: 'Information Architecture',
    backgroundColor: '#B2E9AA',
  },
  {
    name: 'React',
    backgroundColor: '#B2E9AA',
  },
  {
    name: 'Vue',
    backgroundColor: '#B2E9AA',
  },
  {
    name: 'Angular',
    backgroundColor: '#B2E9AA',
  },
  {
    name: 'Node',
    backgroundColor: '#E9AAAA',
  },
  {
    name: 'UI Design',
    backgroundColor: '#E9DBAA',
  },
  {
    name: 'Node',
    backgroundColor: '#E9AAAA',
  },
  {
    name: 'Advance Prototyping',
    backgroundColor: '#E9AAAA',
  },
  {
    name: 'Node',
    backgroundColor: '#E9DBAA',
  },
  {
    name: 'Angular',
    backgroundColor: '#E9DBAA',
  }
];

const Bio = ({ body }: { body: string }) => {
  return (
    <div className="flex flex-col grow bg-[#FFEFD7] p-4 rounded-4 gap-3 border border-yellow-dark rounded-2xl">
      <h3 className="text-left text-title text-lg font-medium">Bio</h3>
      <div>{body}</div>
    </div>
  );
};
