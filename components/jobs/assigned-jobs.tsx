import React from 'react';
import type { Job } from '@/lib/types';
import { Tabs } from '@/components/common/tabs';
import { TalentJobCard } from '@/components/jobs/job-cards/assigned-job';
import { paginate } from '@/lib/utils';
import { useGetJobs } from '@/lib/api/job';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { Pagination } from '@/components/common/pagination';

interface Props {}

export const AcceptedJobs: React.FC<Props> = () => {
  const jobsData = useGetJobs({ category: 'assigned' });

  if (jobsData.isError) return <PageError className="rounded-2xl border border-red-200 h-[85vh]" />;
  if (jobsData.isLoading) return <PageLoading className="rounded-2xl border border-line h-[85vh]" />;

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

  const ongoingJobs = sortedJobs.filter(
    (job) =>
      job.payoutStatus !== 'completed' &&
      job.inviteAccepted &&
      !talentAndClientHasReviewed(job) &&
      job.status !== 'cancelled',
  );
  const completedJobs = sortedJobs.filter(
    (job) => job.payoutStatus === 'completed' || talentAndClientHasReviewed(job) || job.status === 'cancelled',
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <Tabs
        urlKey="client-jobs"
        tabs={[
          {
            label: 'Ongoing',
            value: 'ongoing',
            content: <TalentOngoingJobs jobs={ongoingJobs} />,
          },
          { label: 'Completed', value: 'completed', content: <TalentCompletedJobs jobs={completedJobs} /> },
        ]}
      />
    </div>
  );
};

interface OngoingJobsProps {
  jobs: Job[];
}

const TalentOngoingJobs: React.FC<OngoingJobsProps> = ({ jobs }) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  if (!jobs.length)
    return <PageEmpty label="Your ongoing jobs will appear here." className="rounded-lg border border-line h-[80vh]" />;

  const ITEMS_PER_PAGE = 6;
  const TOTAL_PAGES = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = paginate(jobs, ITEMS_PER_PAGE, currentPage);

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
        {paginatedJobs.map(({ _id, paymentFee, name, creator, progress, collections, status }) => {
          return (
            <TalentJobCard
              status={status}
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
      <div className="mt-auto pt-4">
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

interface CompletedJobsProps {
  jobs: Job[];
}

const TalentCompletedJobs: React.FC<CompletedJobsProps> = ({ jobs }) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  if (!jobs.length)
    return (
      <PageEmpty label="Your completed jobs will appear here." className="rounded-lg border border-line h-[80vh]" />
    );

  const ITEMS_PER_PAGE = 6;
  const TOTAL_PAGES = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = paginate(jobs, ITEMS_PER_PAGE, currentPage);

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
        {paginatedJobs.map(({ _id, paymentFee, name, creator, progress, collections, status, ratings, owner }) => {
          const talentHasReviewed = ratings?.some((review) => review.owner._id === owner?._id);
          const clientHasReviewed = ratings?.some((review) => review.owner._id === creator._id);

          return (
            <TalentJobCard
              jobId={_id}
              status={status}
              key={_id}
              progress={progress}
              price={paymentFee}
              title={name}
              isCompleted={(talentHasReviewed && clientHasReviewed) || status === 'cancelled'}
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
      <div className="mt-auto pt-4">
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};
