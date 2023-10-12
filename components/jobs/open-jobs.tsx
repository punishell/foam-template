import React from 'react';
import type { Bookmark, Job } from '@/lib/types';
import { Tabs } from '@/components/common/tabs';
import { JobSearchBar } from '@/components/jobs/job-search-bar';
import { OpenJobCard } from '@/components/jobs/job-cards/open-job';
import { paginate } from '@/lib/utils';
import { useGetJobs } from '@/lib/api/job';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { useGetBookmarks } from '@/lib/api/bookmark';
import { Pagination } from '@/components/common/pagination';

interface Props { }

export const OpenJobs: React.FC<Props> = () => {
  const jobsData = useGetJobs({ category: 'open', status: "pending" });
  const bookmarkData = useGetBookmarks({ page: 1, limit: 5, filter: { type: 'collection' } });

  if (jobsData.isError || bookmarkData.isError)
    return <PageError className="rounded-2xl border border-red-200 bg-red-50 h-[85vh]" />;
  if (jobsData.isLoading) return <PageLoading className="rounded-2xl border border-line h-[85vh]" />;

  const jobs = jobsData.data.data;

  // sort jobs by latest first
  const sortedJobs = jobs.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const onRefresh = async () => {
    await Promise.all([
      jobsData.refetch(),
      bookmarkData.refetch()
    ])
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <JobSearchBar />
      <div className="flex h-full grow">
        <Tabs
          urlKey="open-jobs"
          tabs={[
            {
              label: 'All',
              value: 'all',
              content: <AllJobs jobs={sortedJobs} onRefresh={onRefresh} />,
            },
            {
              label: 'Saved',
              value: 'saved',
              content: (
                <SavedJobs
                  jobs={bookmarkData.data?.data ?? []}
                  isError={bookmarkData.isError}
                  isLoading={bookmarkData.isLoading}
                  onRefresh={onRefresh}
                />
              ),
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
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const paginatedJobs = paginate(jobs, itemsPerPage, currentPage);

  if (!jobs.length) return <PageEmpty label="No open jobs yet." className="rounded-2xl border border-line h-[70vh]" />;

  return (
    <div className="flex flex-col gap-2 pb-2 xh-full min-h-[70vh]">
      <div className="grid grid-cols-2 gap-4 overflow-y-auto ">
        {paginatedJobs.map(({ _id, paymentFee, name, tags, creator, isBookmarked, bookmarkId }) => {
          return (
            <OpenJobCard
              id={_id}
              key={_id}
              price={paymentFee}
              title={name}
              skills={tags}
              creator={{
                _id: creator._id,
                paktScore: creator.score,
                avatar: creator.profileImage?.url,
                name: `${creator.firstName} ${creator.lastName}`,
              }}
              isBookmarked={isBookmarked}
              bookmarkId={bookmarkId ?? ''}
              onRefresh={onRefresh}
            />
          );
        })}
      </div>
      <div className="mt-auto">
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
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
    return (
      <PageEmpty label="Your saved jobs will appear here." className="rounded-lg border border-line h-full py-6" />
    );

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
              _id: creator._id,
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
