import React, { useMemo } from 'react';

import { useDismissAllFeed, useDismissFeed, useGetTimeline } from '@/lib/api/dashboard';
import { ParseFeedView } from './utils';
import { Spinner } from '../common';
import { useUserState } from '@/lib/store/account';
import { PageEmpty } from '../common/page-empty';
import { PageLoading } from '../common/page-loading';
import { PageError } from '../common/page-error';

export const Feeds = () => {
  const { _id: loggedInUser } = useUserState()
  const { data: timelineData, refetch: feedRefetch, isFetching, isFetched, isError } = useGetTimeline({ page: 1, limit: 100, filter: { isOwner: true, isPublic: true } });

  const callback = async () => {
    await Promise.all([
      feedRefetch(),
    ]);
  };
  const dismissFeed = useDismissFeed();

  const dismissByID = (id: string) => {
    dismissFeed.mutate(id, {
      onSuccess: () => {
        // refetch feeds
        callback && callback();
      }
    });
  }

  const timelineFeeds = useMemo(() => (timelineData?.data || []).map((feed, i) => ParseFeedView(feed, loggedInUser, i, callback, dismissByID)), [timelineData?.data])
  if (!isFetched && isFetching) return <PageLoading className="h-[80%]" />;
  if (isError) return <PageError className="rounded-xl border border-red-100 h-[80%]" />;
  if (timelineFeeds.length === 0) return <PageEmpty className="h-[80%]" />;

  if (isFetching && !isFetched) return <div className="flex flex-col gap-5 mt-4 rounded-2xl p-4 w-full"><Spinner /></div>
  if (timelineFeeds.length === 0) return <div className='flex flex-col gap-5 mt-4 w-full p-4'><p className='text-center'>No Feeds Received</p></div>

  return (
    <div className="flex flex-col gap-5 border border-line bg-white rounded-2xl p-4 w-full">
      {timelineFeeds}
    </div>
  );
};