'use client';

import React from 'react';
import { Tabs } from '@/components/common/tabs';
import { AssignedJob } from '@/components/jobs/job-cards/assigned-job';
import { UnAssignedJob } from '@/components/jobs/job-cards/unassigned-job';

interface Props {}

export const CreatedJobs: React.FC<Props> = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Tabs
          urlKey="my-jobs"
          tabs={[
            {
              label: 'Ongoing',
              value: 'ongoing',
              content: <OngoingJobs />,
            },
            { label: 'Completed', value: 'completed', content: <CompletedJobs /> },
            { label: 'Unassigned', value: 'unassigned', content: <UnassignedJobs /> },
          ]}
        />
      </div>
    </div>
  );
};

const UnassignedJobs = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <UnAssignedJob createdAt="2 days ago" price={100} title='I need a logo for my new business "Pakt"' />
      <UnAssignedJob createdAt="2 days ago" price={100} title='I need a logo for my new business "Pakt"' />
    </div>
  );
};

const OngoingJobs = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <AssignedJob
        inviter={{
          avatar: 'https://i.pravatar.cc/300',
          name: 'John Doe',
          paktScore: 100,
        }}
        price={100}
        title='I need a logo for my new business "Pakt"'
      />
    </div>
  );
};

const CompletedJobs = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <AssignedJob
        inviter={{
          avatar: 'https://i.pravatar.cc/300',
          name: 'John Doe',
          paktScore: 100,
        }}
        price={100}
        title='I need a logo for my new business "Pakt"'
      />
    </div>
  );
};
