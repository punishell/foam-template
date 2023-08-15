import React from 'react';
import { Tabs } from '@/components/common/tabs';
import { PublicJobCard } from '@/components/jobs';
import { JobSearchBar } from '@/components/jobs/job-search-bar';

interface Props {}

export const OpenJobs: React.FC<Props> = () => {
  return (
    <div className="flex flex-col gap-6">
      <JobSearchBar />
      <div>
        <Tabs
          urlKey="open-jobs"
          tabs={[
            {
              label: 'All',
              value: 'all',
              content: <AllJobs />,
            },
            {
              label: 'Saved',
              value: 'saved',
              content: <SavedJobs />,
            },
          ]}
        />
      </div>
    </div>
  );
};

interface AllJobsProps {}

const AllJobs: React.FC<AllJobsProps> = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <PublicJobCard
        price={100}
        title='I need a logo for my new business "Pakt"'
        skills={['Logo Design', 'Graphic Design', 'Illustration']}
        creator={{
          avatar: 'https://i.pravatar.cc/300',
          name: 'John Doe',
          paktScore: 100,
        }}
      />
      <PublicJobCard
        price={100}
        title='I need a logo for my new business "Pakt"'
        skills={['Logo Design', 'Graphic Design', 'Illustration']}
        creator={{
          avatar: 'https://i.pravatar.cc/300',
          name: 'John Doe',
          paktScore: 100,
        }}
      />
      <PublicJobCard
        price={100}
        title='I need a logo for my new business "Pakt"'
        skills={['Logo Design', 'Graphic Design', 'Illustration']}
        creator={{
          avatar: 'https://i.pravatar.cc/300',
          name: 'John Doe',
          paktScore: 100,
        }}
      />
    </div>
  );
};

interface SavedJobsProps {}

const SavedJobs: React.FC<SavedJobsProps> = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <PublicJobCard
        price={100}
        title='I need a logo for my new business "Pakt"'
        skills={['Logo Design', 'Graphic Design', 'Illustration']}
        creator={{
          avatar: 'https://i.pravatar.cc/300',
          name: 'John Doe',
          paktScore: 100,
        }}
      />
    </div>
  );
};
