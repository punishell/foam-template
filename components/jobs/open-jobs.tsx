import React from 'react';
import type { Job } from '@/lib/types';
import { Tabs } from '@/components/common/tabs';
import { JobSearchBar } from '@/components/jobs/job-search-bar';
import { OpenJobCard } from '@/components/jobs/job-cards/open-job';

import { useGetJobs } from '@/lib/api/job';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';

interface Props {}

export const OpenJobs: React.FC<Props> = () => {
  const jobsData = useGetJobs({ category: 'open' });

  if (jobsData.isError) return <PageError />;
  if (jobsData.isLoading) return <PageLoading />;

  const jobs = jobsData.data.data;

  return (
    <div className="flex flex-col gap-6 h-full">
      <JobSearchBar />
      <div className="h-ful grow">
        <Tabs
          urlKey="open-jobs"
          tabs={[
            {
              label: 'All',
              value: 'all',
              content: <AllJobs jobs={jobs} />,
            },
            {
              label: 'Saved',
              value: 'saved',
              content: <SavedJobs jobs={[]} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

interface AllJobsProps {
  jobs: Job[];
}

const AllJobs: React.FC<AllJobsProps> = ({ jobs }) => {
  if (!jobs.length) return <PageEmpty label="No open jobs yet." className="rounded-lg border border-line h-full" />;

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id, paymentFee, name, tagsData, creator }) => {
        return (
          <OpenJobCard
            id={_id}
            key={_id}
            price={paymentFee}
            title={name}
            skills={tagsData}
            creator={{
              paktScore: creator.score,
              avatar: creator.profileImage?.url,
              name: `${creator.firstName} ${creator.lastName}`,
            }}
          />
        );
      })}
    </div>
  );
};

interface SavedJobsProps {
  jobs: Job[];
}

const SavedJobs: React.FC<SavedJobsProps> = ({ jobs }) => {
  if (!jobs.length)
    return <PageEmpty label="Your saved jobs will appear here." className="rounded-lg border border-line h-full" />;

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id, paymentFee, name, tagsData, creator }) => {
        return (
          <OpenJobCard
            id={_id}
            key={_id}
            price={paymentFee}
            title={name}
            skills={tagsData}
            creator={{
              paktScore: creator.score,
              avatar: creator.profileImage?.url,
              name: `${creator.firstName} ${creator.lastName}`,
            }}
          />
        );
      })}
    </div>
  );
};
