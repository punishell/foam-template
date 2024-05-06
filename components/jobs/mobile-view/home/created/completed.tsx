"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job } from "@/lib/types";
import { ClientJobCard } from "./client-card";
import { PageEmpty } from "@/components/common/page-empty";

interface CompletedJobsProps {
    jobs: Job[];
}

export const CompletedJobs = ({ jobs }: CompletedJobsProps): JSX.Element => {
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
                        collections,
                        status,
                        owner,
                        // creator,
                        ratings,
                    }) => {
                        // const talentHasReviewed = ratings?.some(
                        //     (review) => review.owner._id === owner?._id
                        // );
                        // const clientHasReviewed = ratings?.some(
                        //     (review) => review.owner._id === creator._id
                        // );

                        return (
                            <ClientJobCard
                                jobId={_id}
                                isCancelled={status === "cancelled"}
                                isCompleted={
                                    // (talentHasReviewed && clientHasReviewed) ??
                                    status === "completed"
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
                                key={_id}
                                price={paymentFee}
                                title={name}
                                reviewText={ratings?.[0]?.review ?? ""}
                                ratingCount={ratings?.[0]?.rating ?? 0}
                                talent={{
                                    id: owner?._id ?? "",
                                    paktScore: owner?.score ?? 0,
                                    avatar: owner?.profileImage?.url,
                                    name: `${owner?.firstName} ${owner?.lastName}`,
                                    title: owner?.profile.bio.title ?? "",
                                }}
                            />
                        );
                    }
                )
            )}
        </div>
    );
};
