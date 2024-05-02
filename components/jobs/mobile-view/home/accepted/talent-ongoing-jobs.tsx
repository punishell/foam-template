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

interface OngoingJobsProps {
    jobs: Job[];
}

export const TalentOngoingJobs = ({ jobs }: OngoingJobsProps): ReactElement => {
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
                        creator,
                        collections,
                        status,
                    }) => {
                        return (
                            <TalentJobCard
                                status={status}
                                jobId={_id}
                                key={_id}
                                price={paymentFee}
                                title={name}
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
                                    title: creator?.profile.bio.title ?? "",
                                }}
                            />
                        );
                    }
                )
            )}
        </div>
    );
};
