"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ParseFeedView } from "../feeds";
import { useUserState } from "@/lib/store/account";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { PageEmpty } from "../../common/page-empty";
import { PageLoading } from "../../common/page-loading";
import { PageError } from "../../common/page-error";
import { TabContentWrapper } from "./tab-contents-wrapper";

export const FeedsBookmark = (): ReactElement => {
    const { _id: loggedInUser } = useUserState();
    const {
        data: bookmarkData,
        isFetched,
        isFetching,
        refetch,
        isError,
    } = useGetBookmarks({ page: 1, limit: 10, filter: { type: "feed" } });

    const bookmarks = useMemo(
        () =>
            (bookmarkData?.data ?? []).map((feed, i) =>
                ParseFeedView(
                    { ...feed.feed, bookmarkId: feed._id, isBookmarked: true },
                    loggedInUser,
                    i,
                    refetch
                )
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [bookmarkData?.data]
    );

    return (
        <TabContentWrapper>
            {!isFetched && isFetching ? (
                <PageLoading
                    className="h-[35vh] 2xl:h-[50vh]"
                    color="#007C5B"
                />
            ) : isError ? (
                <PageError className="h-[35vh] 2xl:h-[50vh]" />
            ) : bookmarks.length === 0 ? (
                <PageEmpty
                    className="h-[35vh] 2xl:h-[50vh]"
                    label="Bookmarked notifications will appear here"
                />
            ) : (
                bookmarks
            )}
        </TabContentWrapper>
    );
};
