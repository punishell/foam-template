import React from 'react';
import type { Job } from '@/lib/types';
import { Tabs } from '@/components/common/tabs';
import { AssignedJobTalentCard } from '@/components/jobs/job-cards/assigned-job';

import { useGetJobs } from '@/lib/api/job';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';

interface Props {}

export const AcceptedJobs: React.FC<Props> = () => {
  const jobsData = useGetJobs({ category: 'assigned' });

  if (jobsData.isError) return <PageError />;
  if (jobsData.isLoading) return <PageLoading />;

  const jobs = jobsData.data.data;

  return (
    <div className="flex flex-col gap-6 h-full">
      <Tabs
        urlKey="client-jobs"
        tabs={[
          {
            label: 'Ongoing',
            value: 'ongoing',
            content: <OngoingJobs jobs={jobs} />,
          },
          { label: 'Completed', value: 'completed', content: <CompletedJobs jobs={jobs} /> },
        ]}
      />
    </div>
  );
};

interface OngoingJobsProps {
  jobs: Job[];
}

const OngoingJobs: React.FC<OngoingJobsProps> = ({ jobs }) => {
  if (!jobs.length)
    return <PageEmpty label="Your ongoing jobs will appear here." className="rounded-lg border border-line h-[90%]" />;

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id, paymentFee, name, creator }) => {
        return (
          <AssignedJobTalentCard
            id={_id}
            key={_id}
            price={paymentFee}
            title={name}
            inviter={{
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

interface CompletedJobsProps {
  jobs: Job[];
}

const CompletedJobs: React.FC<CompletedJobsProps> = ({ jobs }) => {
  if (!jobs.length)
    return (
      <PageEmpty label="Your completed jobs will appear here." className="rounded-lg border border-line h-[90%]" />
    );

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id, paymentFee, name, creator }) => {
        return (
          <AssignedJobTalentCard
            id={_id}
            key={_id}
            price={paymentFee}
            title={name}
            inviter={{
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
