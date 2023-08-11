'use client';

import { Button } from 'pakt-ui';
import { Feeds } from '@/components/overview/feeds';
import { Header } from '@/components/overview/header';
import { PaktScore } from '@/components/overview/paktscore';
import { LeaderBoard } from '@/components/overview/leaderboard';

import { Briefcase, Search, Plus } from 'lucide-react';

export default function Overview() {
  return (
    <div className="flex flex-col gap-8 relative h-full">
      <Header />

      <div className="flex gap-6 h-full">
        <div className="grow overflow-y-auto h-full pb-20">
          <div className="grid gap-4 grid-cols-2">
            <div className="border-2 bg-[#ECFCE5] p-4 rounded-2xl border-primary relative overflow-hidden">
              <div className="flex flex-col gap-4">
                <p className="text-xl font-bold max-w-[260px]">Short text on creating a job comes here</p>
                <Button size="sm">
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
                <Button variant="secondary" size="sm">
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

          <Feeds />
        </div>

        <div className="basis-[300px] h-full gap-7 w-fit flex flex-col items-center">
          <PaktScore score={100} />
          <LeaderBoard />
        </div>
      </div>
    </div>
  );
}
