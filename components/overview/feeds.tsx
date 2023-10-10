import React, { useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const {
    data: timelineData,
    refetch: feedRefetch,
    isLoading,
    isFetching,
    isFetched,
    isError,
  } = useGetTimeline({ page: currentPage, limit: 10, filter: { isOwner: true, type: `${FEED_TYPES.JOB_DELIVERABLE_UPDATE},${FEED_TYPES.JOB_APPLICATION_SUBMITTED},${FEED_TYPES.JOB_CANCELLED},${FEED_TYPES.JOB_COMPLETION},${FEED_TYPES.JOB_INVITATION_ACCEPTED},${FEED_TYPES.JOB_INVITATION_DECLINED},${FEED_TYPES.JOB_INVITATION_RECEIVED},${FEED_TYPES.PUBLIC_JOB_CREATED},${FEED_TYPES.PUBLIC_JOB_FILLED}`, isPublic: true } });

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

  const fetchMore = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    // @ts-ignore
    const allIds = currentData.map(c => c._id);
    if (timelineData && timelineData.data) {
      // @ts-ignore
      const newData = currentData.concat(timelineData?.data.filter(c => !allIds.includes(c._id)));
      setCurrentData(newData);
    }
  }, [timelineData, timelineData?.data]);


  const timelineFeeds = useMemo(
    () => (currentData || []).map((feed, i) => ParseFeedView(feed, loggedInUser, i, callback, dismissByID)),
    [currentData],
  );

  if (isLoading && timelineFeeds.length < 1) return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;
  if (isError) return <PageError className="h-[85vh] rounded-2xl border border-line" />;
  if (timelineFeeds.length === 0) return <PageEmpty className="h-[85vh] rounded-2xl border border-line" />;

  return (
    <div className="relative h-full">
      <div id="timeline-content" className="h-full overflow-y-auto scrollbar-hide [&>*]:mb-5 border border-line bg-white rounded-2xl p-4 w-full">
        <InfiniteScroll
          scrollThreshold={0.8}
          scrollableTarget="timeline-content"
          dataLength={timelineData?.total ?? 1}
          next={fetchMore}
          hasMore={(timelineData?.page ?? 1) < (timelineData?.pages ?? 1)}
          loader={<div className='my-4'><Spinner size={25} /></div>}
          className='[&>*]:mb-5'
        >
          {timelineFeeds}
        </InfiniteScroll>
      </div>
      <div className="absolute left-0 right-0 -bottom-[0px] h-10 z-50 bg-gradient-to-b from-transparent via-transparent to-green-50 rounded-2xl"></div>
    </div>
  );
};
