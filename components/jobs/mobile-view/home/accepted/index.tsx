"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type { Job } from "@/lib/types";
import { Tabs } from "@/components/common/tabs";
import { useGetJobs } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { TalentOngoingJobs } from "./talent-ongoing-jobs";
import { TalentCompletedJobs } from "./talent-completed-jobs";

export const AcceptedJobs = (): ReactElement => {
    const jobsData = useGetJobs({ category: "assigned" });
    const jobs = jobsData.data?.data;

    // sort jobs by latest first
    const sortedJobs = jobs?.sort((a, b) => {
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    const talentAndClientHasReviewed = (job: Job): boolean => {
        return (
            job.ratings?.some(
                (review) => review.owner._id === job.owner?._id
            ) ??
            job.ratings?.some(
                (review) => review.owner._id === job.creator?._id
            ) ??
            false
        );
    };

    const ongoingJobs = sortedJobs?.filter(
        (job) =>
            job.payoutStatus !== "completed" &&
            job.inviteAccepted &&
            !talentAndClientHasReviewed(job) &&
            job.status !== "cancelled"
    );
    const completedJobs = sortedJobs?.filter(
        (job) =>
            (job.payoutStatus === "completed" ||
                talentAndClientHasReviewed(job)) ??
            job.status === "cancelled"
    );

    return (
        <div className="flex h-full grow">
            {jobsData.isError ? (
                <PageError className="h-[85vh] rounded-2xl border border-red-200" />
            ) : jobsData.isLoading ? (
                <PageLoading className="" color="#007C5B" />
            ) : (
                <Tabs
                    urlKey="client-jobs"
                    tabs={[
                        {
                            label: "Ongoing",
                            value: "ongoing",
                            content: (
                                <TalentOngoingJobs
                                    jobs={ongoingJobs as Job[]}
                                />
                            ),
                        },
                        {
                            label: "Completed",
                            value: "completed",
                            content: (
                                <TalentCompletedJobs
                                    jobs={completedJobs as Job[]}
                                />
                            ),
                        },
                    ]}
                    className="relative h-full border-none"
                    tabListClassName="max-sm:justify-normal bg-emerald-900 border-none px-5 max-sm:h-auto"
                    tabTriggerClassName="radix-state-active:text-white text-white radix-state-active:border-white border-b-[3px] py-[11px]"
                />
            )}
        </div>
    );
};
