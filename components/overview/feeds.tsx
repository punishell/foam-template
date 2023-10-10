import React, { useMemo } from 'react';

import { useDismissAllFeed, useDismissFeed, useGetTimeline } from '@/lib/api/dashboard';
import { ParseFeedView } from './utils';
import { Spinner } from '../common';
import { useUserState } from '@/lib/store/account';
import { PageEmpty } from '../common/page-empty';
import { PageLoading } from '../common/page-loading';
import { PageError } from '../common/page-error';
import { FEED_TYPES } from '@/lib/utils';

export const Feeds = () => {
  const { _id: loggedInUser } = useUserState();
  const {
    data: timelineData,
    refetch: feedRefetch,
    isLoading,
    isFetching,
    isFetched,
    isError,
  } = useGetTimeline({ page: 1, limit: 10, filter: { isOwner: true, type: `${FEED_TYPES.JOB_DELIVERABLE_UPDATE},${FEED_TYPES.JOB_APPLICATION_SUBMITTED},${FEED_TYPES.JOB_CANCELLED},${FEED_TYPES.JOB_COMPLETION},${FEED_TYPES.JOB_INVITATION_ACCEPTED},${FEED_TYPES.JOB_INVITATION_DECLINED},${FEED_TYPES.JOB_INVITATION_RECEIVED},${FEED_TYPES.PUBLIC_JOB_CREATED},${FEED_TYPES.PUBLIC_JOB_FILLED}`, isPublic: true } });
  console.log("timeline=--->", timelineData);
  const callback = async () => {
    await Promise.all([feedRefetch()]);
  };
  const dismissFeed = useDismissFeed();

  const dismissByID = (id: string) => {
    dismissFeed.mutate(id, {
      onSuccess: () => {
        // refetch feeds
        callback && callback();
      },
    });
  };

  const timelineFeeds = useMemo(
    () => (timelineData?.data || []).map((feed, i) => ParseFeedView(feed, loggedInUser, i, callback, dismissByID)),
    [timelineData?.data],
  );
  if (isLoading) return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;
  if (isError) return <PageError className="h-[85vh] rounded-2xl border border-line" />;
  if (timelineFeeds.length === 0) return <PageEmpty className="h-[85vh] rounded-2xl border border-line" />;

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto scrollbar-hide [&>*]:mb-5 border border-line bg-white rounded-2xl p-4 w-full">
        {timelineFeeds}
      </div>
      <div className="absolute left-0 right-0 -bottom-[0px] h-10 z-50 bg-gradient-to-b from-transparent via-transparent to-green-50 rounded-2xl"></div>
    </div>
  );
};
