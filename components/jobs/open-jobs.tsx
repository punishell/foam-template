import React from 'react';
import type { Bookmark, Job } from '@/lib/types';
import { Tabs } from '@/components/common/tabs';
import { JobSearchBar } from '@/components/jobs/job-search-bar';
import { OpenJobCard } from '@/components/jobs/job-cards/open-job';

import { useGetJobs } from '@/lib/api/job';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { useGetBookmarks } from '@/lib/api/bookmark';

interface Props { }

export const OpenJobs: React.FC<Props> = () => {
  const jobsData = useGetJobs({ category: 'open' });
  const bookmarkData = useGetBookmarks({ page: 1, limit: 5, filter: { type: "collection" } })

  if (jobsData.isError || bookmarkData.isError) return <PageError />;
  if (jobsData.isLoading) return <PageLoading />;

  const jobs = jobsData.data.data;
  console.log(jobs, bookmarkData.data?.data)
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
              content: <AllJobs jobs={jobs} onRefresh={jobsData.refetch} />,
            },
            {
              label: 'Saved',
              value: 'saved',
              content: <SavedJobs jobs={bookmarkData.data?.data ?? []} isError={bookmarkData.isError} isLoading={bookmarkData.isLoading} onRefresh={bookmarkData.refetch} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

interface AllJobsProps {
  jobs: Job[];
  onRefresh?: () => void;
}

const AllJobs: React.FC<AllJobsProps> = ({ jobs, onRefresh }) => {
  if (!jobs.length) return <PageEmpty label="No open jobs yet." className="rounded-lg border border-line h-full" />;

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id, paymentFee, name, tags, creator, isBookmarked }) => {
        return (
          <OpenJobCard
            id={_id}
            key={_id}
            price={paymentFee}
            title={name}
            skills={tags}
            creator={{
              paktScore: creator.score,
              avatar: creator.profileImage?.url,
              name: `${creator.firstName} ${creator.lastName}`,
            }}
            isBookmarked={isBookmarked}
            bookmarkId={_id}
            onRefresh={onRefresh}
          />
        );
      })}
    </div>
  );
};

interface SavedJobsProps {
  isError: boolean;
  isLoading: boolean;
  jobs: Bookmark[];
  onRefresh?: () => void;
}

const SavedJobs: React.FC<SavedJobsProps> = ({ jobs, isError, isLoading, onRefresh }) => {

  if (isError) return <PageError />;
  if (isLoading) return <PageLoading />;
  if (!jobs.length)
    return <PageEmpty label="Your saved jobs will appear here." className="rounded-lg border border-line h-full" />;

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
      {jobs.map(({ _id: bookmarkId, data: { _id, paymentFee, name, tags, creator } }) => {
        return (
          <OpenJobCard
            id={_id}
            key={_id}
            price={paymentFee}
            title={name}
            skills={tags}
            creator={{
              paktScore: creator.score,
              avatar: creator.profileImage?.url,
              name: `${creator.firstName} ${creator.lastName}`,
            }}
            isBookmarked={true}
            bookmarkId={bookmarkId ?? _id}
            onRefresh={onRefresh}
          />
        );
      })}
    </div>
  );
};
