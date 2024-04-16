"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job } from "@/lib/types";
import { Tabs } from "@/components/common/tabs";
import { useGetJobs } from "@/lib/api/job";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { OngoingJobs } from "./ongoing";
import { CompletedJobs } from "./completed";
import { UnassignedJobs } from "./unassigned";

export const CreatedJobs = (): ReactElement => {
	const jobsData = useGetJobs({ category: "created" });

	if (jobsData.isError) return <PageError className="h-[85vh] rounded-2xl border border-red-200" />;
	if (jobsData.isLoading) return <PageLoading className="h-[85vh] rounded-2xl border border-line" color="#007C5B" />;

	const jobs = jobsData.data.data;

	// sort jobs by latest first
	const sortedJobs = jobs.sort((a, b) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	const talentAndClientHasReviewed = (job: Job): boolean => {
		return (
			job.ratings?.some((review) => review.owner._id === job.owner?._id) ??
			job.ratings?.some((review) => review.owner._id === job.creator?._id) ??
			false
		);
	};

	const completedJobs = sortedJobs.filter(
		(job) => (job.payoutStatus === "completed" || talentAndClientHasReviewed(job)) ?? job.status === "cancelled",
	);
	const ongoingJobs = sortedJobs.filter(
		(job) =>
			job.payoutStatus !== "completed" &&
			job.inviteAccepted &&
			!talentAndClientHasReviewed(job) &&
			job.status !== "cancelled",
	);
	const unassignedJobs = sortedJobs.filter(
		(job) => job.status === "pending" || (job.status === "ongoing" && !job.inviteAccepted),
	);

	return (
		<div className="flex h-full flex-col gap-6">
			<Tabs
				urlKey="my-jobs"
				tabs={[
					{
						label: "Ongoing",
						value: "ongoing",
						content: <OngoingJobs jobs={ongoingJobs} />,
					},
					{
						label: "Completed",
						value: "completed",
						content: <CompletedJobs jobs={completedJobs} />,
					},
					{
						label: "Unassigned",
						value: "unassigned",
						content: <UnassignedJobs jobs={unassignedJobs} />,
					},
				]}
			/>
		</div>
	);
};
