"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { OpenJobCard } from "./open-card";
import type { Bookmark } from "@/lib/types";

interface SavedJobsProps {
    isError: boolean;
    isLoading: boolean;
    jobs: Bookmark[];
    onRefresh?: () => void;
}

export const SavedJobs = ({
    jobs,
    isError,
    isLoading,
    onRefresh,
}: SavedJobsProps): ReactElement | null => {
    return (
        <div className="flex h-full flex-col overflow-y-scroll">
            {isError ? (
                <PageError />
            ) : isLoading ? (
                <PageLoading color="#007C5B" />
            ) : !jobs.length ? (
                <PageEmpty
                    label="Your saved jobs will appear here."
                    className=""
                />
            ) : (
                jobs.map(
                    ({
                        _id: bookmarkId,
                        data: { _id, paymentFee, name, tags, creator },
                    }) => {
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
                                    title: creator.profile.bio.title,
                                }}
                                isBookmarked
                                bookmarkId={bookmarkId ?? _id}
                                onRefresh={onRefresh}
                            />
                        );
                    }
                )
            )}
        </div>
    );
};
