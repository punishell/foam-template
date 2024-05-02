"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job } from "@/lib/types";
import { ClientJobCard } from "./client-card";
import { PageEmpty } from "@/components/common/page-empty";

interface OngoingJobsProps {
    jobs: Job[];
}

export const OngoingJobs: React.FC<OngoingJobsProps> = ({ jobs }) => {
    return (
        <div className="flex h-full w-full flex-col overflow-y-scroll">
            {!jobs.length ? (
                <PageEmpty
                    label="Your ongoing jobs will appear here."
                    className=""
                />
            ) : (
                jobs.map(
                    ({
                        _id,
                        paymentFee,
                        name,
                        collections,
                        owner,
                        // progress,
                    }) => {
                        // const reviewRequestChange = collections.find(
                        //     isReviewChangeRequest
                        // );
                        return (
                            <ClientJobCard
                                totalDeliverables={
                                    collections.filter(
                                        (collection) =>
                                            collection.type === "deliverable"
                                    ).length
                                }
                                completedDeliverables={
                                    collections.filter(
                                        (collection) =>
                                            collection.type === "deliverable" &&
                                            collection.progress === 100
                                    ).length
                                }
                                // reviewRequestChange={reviewRequestChange}
                                jobId={_id}
                                key={_id}
                                price={paymentFee}
                                title={name}
                                talent={{
                                    id: owner?._id ?? "",
                                    paktScore: owner?.score ?? 0,
                                    avatar: owner?.profileImage?.url,
                                    name: `${owner?.firstName} ${owner?.lastName}`,
                                    title: owner?.profile.bio.title ?? "",
                                }}
                                // jobProgress={progress}
                            />
                        );
                    }
                )
            )}
        </div>
    );
};
