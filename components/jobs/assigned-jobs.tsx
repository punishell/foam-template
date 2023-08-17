import React from 'react';
import { Job } from '@/components/jobs/';
import { Tabs } from '@/components/common/tabs';

interface Props {}

export const AcceptedJobs: React.FC<Props> = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Tabs
          urlKey="client-jobs"
          tabs={[
            {
              label: 'Ongoing',
              value: 'ongoing',
              content: <OngoingJobs />,
            },
            { label: 'Completed', value: 'completed', content: <CompletedJobs /> },
          ]}
        />
      </div>
    </div>
  );
};

const OngoingJobs = () => {
  return (
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
    </div>
  );
};

const CompletedJobs = () => {
  return (
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
    </div>
  );
};
