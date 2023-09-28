import React from 'react';
import type { Job } from '@/lib/types';
import { Tabs } from '@/components/common/tabs';
import { TalentJobCard } from '@/components/jobs/job-cards/assigned-job';

import { useGetJobs } from '@/lib/api/job';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';

interface Props {}

export const AcceptedJobs: React.FC<Props> = () => {
  const jobsData = useGetJobs({ category: 'assigned' });

  if (jobsData.isError) return <PageError className="rounded-xl border border-red-100 h-[90%]" />;
  if (jobsData.isLoading) return <PageLoading className="rounded-xl border border-line h-[90%]" />;

  const jobs = jobsData.data.data;

  const completedJob = jobs.filter((job) => job.progress === 100);

  return (
    <div className="flex flex-col gap-6 h-full">
      <Tabs
        urlKey="client-jobs"
        tabs={[
          {
            label: 'Ongoing',
            value: 'ongoing',
            content: <TalentOngoingJobs jobs={jobs} />,
          },
          { label: 'Completed', value: 'completed', content: <TalentCompletedJobs jobs={completedJob} /> },
        ]}
      />
    </div>
  );
};

interface OngoingJobsProps {
  jobs: Job[];
}

const TalentOngoingJobs: React.FC<OngoingJobsProps> = ({ jobs }) => {
  if (!jobs.length)
    return <PageEmpty label="Your ongoing jobs will appear here." className="rounded-lg border border-line h-[90%]" />;

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id, paymentFee, name, creator, progress, collections }) => {
        return (
          <TalentJobCard
            jobId={_id}
            key={_id}
            progress={progress}
            price={paymentFee}
            title={name}
            totalDeliverables={collections.filter((collection) => collection.type === 'deliverable').length}
            client={{
              id: creator._id,
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

const TalentCompletedJobs: React.FC<CompletedJobsProps> = ({ jobs }) => {
  if (!jobs.length)
    return (
      <PageEmpty label="Your completed jobs will appear here." className="rounded-lg border border-line h-[90%]" />
    );

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id, paymentFee, name, creator, progress, collections }) => {
        return (
          <TalentJobCard
            jobId={_id}
            key={_id}
            progress={progress}
            price={paymentFee}
            title={name}
            totalDeliverables={collections.filter((collection) => collection.type === 'deliverable').length}
            client={{
              id: creator._id,
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
