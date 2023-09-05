import React, { useMemo } from 'react';

import { Spinner } from '../common';
import { useGetTimeline } from '@/lib/api/dashboard';
import { FEED_TYPES } from '@/lib/utils';
import { ParseFeedView } from './utils';
import { useUserState } from '@/lib/store/account';

export const ActiveJobs = () => {
  const { _id: loggedInUser } = useUserState();
  const { data: jobData, isFetched, isFetching } = useGetTimeline({ page: 1, limit: 10, filter: { type: [FEED_TYPES.COLLECTION_COMPLETED, FEED_TYPES.COLLECTION_CREATED, FEED_TYPES.COLLECTION_DELIVERED, FEED_TYPES.COLLECTION_UPDATE, FEED_TYPES.COLLECTION_CANCELLED] } });

  const activeJobs = useMemo(() => (jobData?.data || []).map((feed, i) => ParseFeedView(feed, loggedInUser)), [jobData?.data]);

  if (isFetching && !isFetched) return <div className="flex flex-col gap-5 mt-4 rounded-2xl p-4 w-full"><Spinner /></div>;
  if (activeJobs.length == 0) return <div className='flex flex-col gap-5 mt-4 w-full p-4'><p className='text-center'>No Active Job feeds</p></div>

  return (
    <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">
      {activeJobs}
    </div>
  );
};