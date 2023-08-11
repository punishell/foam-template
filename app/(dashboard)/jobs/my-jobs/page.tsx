'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Input } from 'pakt-ui';
import { Plus } from 'lucide-react';
import { PublicJob } from '@/components/jobs';
import { Tabs } from '@/components/common/tabs';
import { Job } from '@/components/jobs/';
import { SearchBar } from '@/components/jobs/search-bar';

export default function MyJobs() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#F0F2F5] p-0.5 text-base text-[#828A9B] w-fit">
          <Link
            href="/jobs/my-jobs"
            className={`rounded-lg flex py-1 px-6 justify-center items-center duration-200 hover:bg-white bg-white`}
          >
            <span>My Jobs</span>
          </Link>
          <Link
            href="/jobs/public-jobs"
            className={`rounded-lg flex justify-center items-center  py-1 px-6 duration-200 hover:bg-white`}
          >
            <span>Public Jobs</span>
          </Link>
        </div>

        <Button>
          <div className="flex items-center gap-2">
            <Plus size={20} />
            <span>Create Job</span>
          </div>
        </Button>
      </div>

      <SearchBar />
      <div>
        <Tabs
          tabs={[
            {
              label: 'All',
              value: 'all',
              content: (
                <div className="grid grid-cols-2 gap-4">
                  <Job
                    type="assigned"
                    inviter={{
                      avatar: 'https://i.pravatar.cc/300',
                      name: 'John Doe',
                      paktScore: 100,
                    }}
                    price={100}
                    title='I need a logo for my new business "Pakt"'
                  />
                  <Job
                    type="unassigned"
                    createdAt="2 days ago"
                    price={100}
                    title='I need a logo for my new business "Pakt"'
                  />
                </div>
              ),
            },

            { label: 'Ongoing', value: 'ongoing', content: <div>Ongoing</div> },
            { label: 'Completed', value: 'completed', content: <div>Completed</div> },
            { label: 'Unassigned', value: 'unassigned', content: <div>Unassigned</div> },
          ]}
        />
      </div>
    </div>
  );
}
