import React, { useMemo } from 'react';

import { useDismissAllFeed, useDismissFeed, useGetTimeline } from '@/lib/api/dashboard';
import { ParseFeedView } from './utils';
import { Spinner } from '../common';
import { useUserState } from '@/lib/store/account';

export const Feeds = () => {
  const { _id: loggedInUser } = useUserState()
  const { data: timelineData, refetch: feedRefetch, isFetching, isFetched } = useGetTimeline({ page: 1, limit: 10, filter: {} });

  // @ts-ignore
  const DismissAll = () => useDismissAllFeed().mutate({}, {
    onSuccess: () => {
      // refetch feeds
      feedRefetch();
    }
  });

  const DismissByID = (id: string) => useDismissFeed().mutate(id, {
    onSuccess: () => {
      // refetch feeds
      feedRefetch();
    }
  });

  const timelineFeeds = useMemo(() => (timelineData?.data || []).map((feed, i) => ParseFeedView(feed, loggedInUser, i)), [timelineData?.data])

  if (isFetching && !isFetched) return <div className="flex flex-col gap-5 mt-4 rounded-2xl p-4 w-full"><Spinner /></div>

  return (
    <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">
      {timelineFeeds}
    </div>
  );
};