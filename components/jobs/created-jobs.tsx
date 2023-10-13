'use client';

import React from 'react';
import { format } from 'date-fns';
import type { Job } from '@/lib/types';
import { Tabs } from '@/components/common/tabs';
import { UnAssignedJobCard } from '@/components/jobs/job-cards/unassigned-job';
import { ClientJobCard } from '@/components/jobs/job-cards/assigned-job';
import { paginate } from '@/lib/utils';
import { useGetJobs } from '@/lib/api/job';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { Pagination } from '@/components/common/pagination';

interface Props {}

export const CreatedJobs: React.FC<Props> = () => {
  const jobsData = useGetJobs({ category: 'created' });

  if (jobsData.isError) return <PageError className="rounded-2xl border border-red-200 h-[85vh]" />;
  if (jobsData.isLoading) return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;

  const jobs = jobsData.data.data;

  // sort jobs by latest first
  const sortedJobs = jobs.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const talentAndClientHasReviewed = (job: Job) => {
    return (
      job.ratings?.some((review) => review.owner._id === job.owner?._id) &&
      job.ratings?.some((review) => review.owner._id === job.creator?._id)
    );
  };

  const completedJobs = sortedJobs.filter((job) => job.payoutStatus === 'completed' || talentAndClientHasReviewed(job));
  const ongoingJobs = sortedJobs.filter(
    (job) => job.payoutStatus !== 'completed' && job.inviteAccepted && !talentAndClientHasReviewed(job),
  );
  const unassignedJobs = sortedJobs.filter(
    (job) => job.status === 'pending' || (job.status === 'ongoing' && job.inviteAccepted === false),
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
  const [currentPage, setCurrentPage] = React.useState(1);
  if (!jobs.length) return <PageEmpty label="No open jobs yet." className="rounded-2xl border border-line h-[80vh]" />;

  const ITEMS_PER_PAGE = 6;
  const TOTAL_PAGES = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = paginate(jobs, ITEMS_PER_PAGE, currentPage);

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
        {paginatedJobs.map((job) => {
          return <UnAssignedJobCard job={job} key={job._id} />;
        })}
      </div>
      <div className="mt-auto pt-4">
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

interface OngoingJobsProps {
  jobs: Job[];
}

const OngoingJobs: React.FC<OngoingJobsProps> = ({ jobs }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  if (!jobs.length)
    return (
      <PageEmpty label="Your ongoing jobs will appear here." className="rounded-2xl border border-line h-[80vh]" />
    );

  const ITEMS_PER_PAGE = 6;
  const TOTAL_PAGES = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = paginate(jobs, ITEMS_PER_PAGE, currentPage);

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
        {paginatedJobs.map(({ _id, paymentFee, name, creator, progress, collections, status, owner }) => {
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
      <div className="mt-auto pt-4">
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

interface CompletedJobsProps {
  jobs: Job[];
}

const CompletedJobs: React.FC<CompletedJobsProps> = ({ jobs }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  if (!jobs.length)
    return (
      <PageEmpty label="Your completed jobs will appear here." className="rounded-2xl border border-line h-[80vh]" />
    );

  const ITEMS_PER_PAGE = 6;
  const TOTAL_PAGES = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = paginate(jobs, ITEMS_PER_PAGE, currentPage);

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
        {paginatedJobs.map(({ _id, paymentFee, name, collections, progress, status, owner, creator, ratings }) => {
          const talentHasReviewed = ratings?.some((review) => review.owner._id === owner?._id);
          const clientHasReviewed = ratings?.some((review) => review.owner._id === creator._id);

          return (
            <ClientJobCard
              jobId={_id}
              status={status}
              progress={progress}
              isCompleted={talentHasReviewed && clientHasReviewed}
              totalDeliverables={collections.filter((collection) => collection.type === 'deliverable').length}
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
      <div className="mt-auto pt-4">
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};
