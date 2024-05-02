"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type { Job } from "@/lib/types";
import { TalentJobCard } from "./talent-card";
import { PageEmpty } from "@/components/common/page-empty";

interface CompletedJobsProps {
    jobs: Job[];
}

export const TalentCompletedJobs = ({
    jobs,
}: CompletedJobsProps): ReactElement => {
    return (
        <div className="flex h-full w-full flex-col overflow-y-scroll">
            {!jobs.length ? (
                <PageEmpty
                    label="Your completed jobs will appear here."
                    className=""
                />
            ) : (
                jobs.map(
                    ({
                        _id,
                        paymentFee,
                        name,
                        creator,
                        collections,
                        status,
                        ratings,
                        owner,
                    }) => {
                        const talentHasReviewed = ratings?.some(
                            (review) => review.owner._id === owner?._id
                        );
                        const clientHasReviewed = ratings?.some(
                            (review) => review.owner._id === creator._id
                        );

                        return (
                            <TalentJobCard
                                jobId={_id}
                                status={status}
                                key={_id}
                                price={paymentFee}
                                title={name}
                                isCompleted={
                                    (talentHasReviewed && clientHasReviewed) ??
                                    status === "cancelled"
                                }
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
                                client={{
                                    id: creator._id,
                                    paktScore: creator.score,
                                    avatar: creator.profileImage?.url,
                                    name: `${creator.firstName} ${creator.lastName}`,
                                    title: owner?.profile.bio.title ?? "",
                                }}
                                reviewText={ratings?.[0]?.review ?? ""}
                                ratingCount={ratings?.[0]?.rating ?? 0}
                            />
                        );
                    }
                )
            )}
        </div>
    );
};
