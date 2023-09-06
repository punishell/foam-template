import React, { useMemo } from 'react';

import { Spinner } from '../common';
import { ParseFeedView } from './utils';
import { useUserState } from '@/lib/store/account';
import { useGetBookmarks } from '@/lib/api/bookmark';

export const FeedsBookmark = () => {
  const { _id: loggedInUser } = useUserState();
  const { data: bookmarkData, isFetched, isFetching } = useGetBookmarks({ page: 1, limit: 10, filter: { type: "feed" } });

  const bookmarks = useMemo(() => (bookmarkData?.data || []).map((feed, i) => ParseFeedView({ ...feed.feed, isBookmarked: true }, loggedInUser)), [bookmarkData?.data]);

  if (isFetching && !isFetched) return <div className="flex flex-col gap-5 mt-4 p-4 w-full"><Spinner /></div>;
  if (bookmarks.length == 0) return <div className='flex flex-col gap-5 mt-4 w-full p-4'><p className='text-center'>No Bookmarked feeds</p></div>

  return (
    <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">
      {bookmarks}
    </div>
  );
};