'use client';

import React from 'react';
import { format } from 'date-fns';
import type { Job } from '@/lib/types';
import { Tabs } from '@/components/common/tabs';
import { UnAssignedJobCard } from '@/components/jobs/job-cards/unassigned-job';
import { ClientJobCard } from '@/components/jobs/job-cards/assigned-job';

import { useGetJobs } from '@/lib/api/job';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';

interface Props {}

export const CreatedJobs: React.FC<Props> = () => {
  const jobsData = useGetJobs({ category: 'created' });

  if (jobsData.isError) return <PageError className="rounded-lg border border-red-300 h-[90%]" />;
  if (jobsData.isLoading) return <PageLoading className="h-[90%] rounded-lg border border-line" />;

  const jobs = jobsData.data.data;

  const completedJobs = jobs.filter((job) => job.payoutStatus === 'completed');
  const ongoingJobs = jobs.filter((job) => job.payoutStatus !== 'completed' && job.owner !== undefined);
  const unassignedJobs = jobs.filter(
    (job) => job.status === 'pending' || (job.status === 'ongoing' && job.owner === undefined),
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <Tabs
        urlKey="my-jobs"
        tabs={[
          {
            label: 'Ongoing',
            value: 'ongoing',
            content: <OngoingJobs jobs={ongoingJobs} />,
          },
          { label: 'Completed', value: 'completed', content: <CompletedJobs jobs={completedJobs} /> },
          { label: 'Unassigned', value: 'unassigned', content: <UnassignedJobs jobs={unassignedJobs} /> },
        ]}
      />
    </div>
  );
};

interface UnassignedJobsProps {
  jobs: Job[];
}

const UnassignedJobs: React.FC<UnassignedJobsProps> = ({ jobs }) => {
  if (!jobs.length) return <PageEmpty label="No open jobs yet." className="rounded-lg border border-line h-[90%]" />;

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id, paymentFee, name, createdAt }) => {
        return (
          <UnAssignedJobCard
            id={_id}
            key={_id}
            price={paymentFee}
            title={name}
            createdAt={format(new Date(createdAt), 'dd MMM yyyy')}
          />
        );
      })}
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
      {jobs.map(({ _id, paymentFee, name, creator, progress, collections, status, owner }) => {
        return (
          <ClientJobCard
            progress={progress}
            status={status}
            totalDeliverables={collections.filter((collection) => collection.type === 'deliverable').length}
            jobId={_id}
            key={_id}
            price={paymentFee}
            title={name}
            talent={{
              id: owner?._id ?? '',
              paktScore: owner?.score ?? 0,
              avatar: owner?.profileImage?.url,
              name: `${owner?.firstName} ${owner?.lastName}`,
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
      <PageEmpty label="Your completed jobs will appear here." className="rounded-lg border border-line h-[80%]" />
    );

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id, paymentFee, name, creator, collections, progress, status }) => {
        return (
          <ClientJobCard
            jobId={_id}
            status={status}
            progress={progress}
            totalDeliverables={collections.filter((collection) => collection.type === 'deliverable').length}
            key={_id}
            price={paymentFee}
            title={name}
            talent={{
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
