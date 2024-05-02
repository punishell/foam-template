"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { forwardRef } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageEmpty } from "@/components/common/page-empty";
import type { Job } from "@/lib/types";
import { PageLoading } from "@/components/common/page-loading";
import { OpenJobCard } from "./open-card";

interface AllJobsProps {
    jobs: Job[];
    onRefresh?: () => void;
    loading?: boolean;
    isFetchingNextPage: boolean;
}

export const AllJobs = forwardRef<HTMLDivElement, AllJobsProps>(
    (props, ref): JSX.Element => {
        const { jobs, onRefresh, loading, isFetchingNextPage } = props;
        return (
            <div className="flex h-full w-full flex-col overflow-y-scroll">
                {loading ? (
                    <PageLoading className="" color="#007C5B" />
                ) : !jobs.length ? (
                    <PageEmpty label="No open jobs yet." className="" />
                ) : (
                    jobs.map(
                        ({
                            _id,
                            paymentFee,
                            name,
                            tags,
                            creator,
                            isBookmarked,
                            bookmarkId,
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
                                    isBookmarked={isBookmarked}
                                    bookmarkId={bookmarkId ?? ""}
                                    onRefresh={onRefresh}
                                />
                            );
                        }
                    )
                )}
                {isFetchingNextPage && (
                    <div className="mx-auto flex w-full flex-row items-center justify-center text-center max-sm:my-4">
                        <Loader
                            size={25}
                            className="animate-spin text-center text-black"
                        />
                    </div>
                )}
                <span ref={ref} />
            </div>
        );
    }
);
