'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Input } from 'pakt-ui';
import { Plus } from 'lucide-react';
import { PublicJob } from '@/components/jobs';
import { Tabs } from '@/components/common/tabs';
import { Job } from '@/components/jobs/';
import { JobSearchBar } from '@/components/jobs/job-search-bar';

interface Props {}

export const CreatedJobs: React.FC<Props> = () => {
  return (
    <div className="flex flex-col gap-6">
      <JobSearchBar />
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
};
