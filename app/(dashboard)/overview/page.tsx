'use client';

import { Button } from 'pakt-ui';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/common/tabs';
import { useGetAccount } from '@/lib/api/account';
import { Feeds } from '@/components/overview/feeds';
import { Header } from '@/components/overview/header';
import { AfroScore } from '@/components/overview/paktscore';
import { LeaderBoard } from '@/components/overview/leaderboard';
import { Invites } from '@/components/overview/invites';
import { ActiveJobs } from '@/components/overview/activeJobs';
import { FeedsBookmark } from '@/components/overview/bookmark';
import { Search, Plus, Briefcase } from 'lucide-react';

export default function Overview() {
  const account = useGetAccount();

  return (
    <div className="flex flex-col gap-8 relative h-full">
      <Header />

      <div className="flex gap-6 h-full">
        <div className="grow overflow-y-auto h-full pb-20">
          <JobHeader />

          <div className="mt-6 w-full">
            <Tabs
              tabs={[
                { label: 'Your Feed', value: 'feed', content: <Feeds /> },
                { label: 'Active Jobs', value: 'active', content: <ActiveJobs /> },
                { label: 'Invites', value: 'invites', content: <Invites /> },
                { label: 'Bookmarks', value: 'bookmarks', content: <FeedsBookmark /> },
              ]}
            />
          </div>
        </div>

        <div className="basis-[300px] shrink-0 h-full gap-7 w-fit flex flex-col items-center">
          <AfroScore score={account.data?.score} />
          <LeaderBoard />
        </div>
      </div>
    </div>
  );
}

const JobHeader = () => {
  const router = useRouter();

  return (
    <div className="grid gap-4 grid-cols-2">
      <div className="border-2 bg-[#ECFCE5] p-4 rounded-2xl border-primary relative overflow-hidden">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold max-w-[260px]">Short text on creating a job comes here</p>
          <Button size="sm" onClick={() => router.push('/jobs/create')}>
            <span className="flex items-center gap-2">
              <Plus size={20} />
              <span>Create Job</span>
            </span>
          </Button>
        </div>

        <div className="absolute right-0 translate-x-1/3 top-2">
          <Briefcase size={200} color="#B4EDB6" />
        </div>
      </div>

      <div className="border-2 p-4 relative overflow-hidden rounded-2xl bg-[#C9F0FF] border-blue-darkest">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold max-w-[260px]">Short text on finding a job comes here</p>
          <Button variant="secondary" size="sm" onClick={() => router.push('/talents')}>
            <span className="flex items-center gap-2">
              <Search size={20} />
              <span>Find Jobs</span>
            </span>
          </Button>
        </div>

        <div className="absolute right-0 translate-x-[30px] top-4">
          <Search size={150} color="#9BDCFD" />
        </div>
      </div>
    </div>
  );
};
