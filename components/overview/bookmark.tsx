import React, { useMemo } from 'react';

import { Spinner } from '../common';
import { ParseFeedView } from './utils';
import { useUserState } from '@/lib/store/account';
import { useGetBookmarks } from '@/lib/api/bookmark';
import { PageEmpty } from '../common/page-empty';
import { PageLoading } from '../common/page-loading';
import { PageError } from '../common/page-error';

export const FeedsBookmark = () => {
  const { _id: loggedInUser } = useUserState();
  const {
    data: bookmarkData,
    isFetched,
    isFetching,
    refetch,
    isError,
  } = useGetBookmarks({ page: 1, limit: 10, filter: { type: 'feed' } });

  const bookmarks = useMemo(
    () =>
      (bookmarkData?.data || []).map((feed, i) =>
        ParseFeedView({ ...feed.feed, bookmarkId: feed._id, isBookmarked: true }, loggedInUser, i, refetch),
      ),
    [bookmarkData?.data],
  );

  if (!isFetched && isFetching) return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;
  if (isError) return <PageError className="rounded-2xl border border-red-200 h-[85vh]" />;
  if (bookmarks.length === 0) return <PageEmpty className="h-[85vh] rounded-2xl border border-line" />;

  return <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">{bookmarks}</div>;
};
