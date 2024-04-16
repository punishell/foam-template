"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { Star } from "lucide-react";
import { Button } from "pakt-ui";
import Rating from "react-rating";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useDeclineReviewChange, useAcceptReviewChange } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import { type Job, isReviewChangeRequest, isJobDeliverable } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface ReviewChangeRequestedProps {
	job: Job;
}

export const ReviewChangeRequested: FC<ReviewChangeRequestedProps> = ({ job }) => {
	const router = useRouter();
	const acceptMutation = useAcceptReviewChange({
		jobId: job._id,
		recipientId: String(job.owner?._id),
	});
	const declineMutation = useDeclineReviewChange({
		jobId: job._id,
		recipientId: String(job.owner?._id),
	});

	const reviewChangeRequest = job.collections.find(isReviewChangeRequest);
	const talent = job.owner;
	const clientReview = job.ratings?.find((review) => review.owner._id === job.creator._id);

	const deliverableIds = job.collections.filter(isJobDeliverable).map((deliverable) => deliverable._id);

	return (
		<>
			<Breadcrumb
				items={[
					{
						label: "Jobs",
						action: () => {
							router.push("/jobs?skills=&search=&range=%2C100&jobs-type=accepted");
						},
					},
					{
						label: "Resubmission",
						active: true,
					},
				]}
			/>
			<div className="flex h-full flex-col gap-6 px-4 py-4">
				<div className="flex flex-col gap-5">
					<h3 className="text-lg font-medium">Request to Improve</h3>
					<div className="flex flex-col gap-3 rounded-xl bg-[#FEF4E3] p-3">
						<p className="text-base text-title">{reviewChangeRequest?.description}</p>

						<div className="flex items-center gap-2 relative -left-[5px]">
							<AfroProfile
								score={talent?.score ?? 0}
								size="sm"
								src={talent?.profileImage?.url}
								url={`/talents/${talent?._id}`}
							/>

							<div className="flex flex-col gap-1">
								<span className="text-base font-bold text-title leading-normal tracking-wide">{`${talent?.firstName} ${talent?.lastName}`}</span>
								<span className="text-xs capitalize leading-[18px] tracking-wide">
									{talent?.profile.bio.title}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-slate-50 p-3">
					<div className="flex w-full items-center justify-between">
						<h3 className="text-sm font-medium text-title">Your review</h3>

						{/*  @ts-expect-error --- */}
						<Rating
							readonly
							initialRating={clientReview?.rating ?? 0}
							fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
							emptySymbol={<Star fill="transparent" color="#15D28E" />}
						/>
					</div>
					<p className="text-body">{clientReview?.review}</p>
				</div>

				<div className="mt-auto flex w-full flex-col items-center gap-3">
					<Button
						fullWidth
						onClick={() => {
							acceptMutation.mutate({
								jobId: job._id,
								reviewId: clientReview?._id ?? "",
								requestId: reviewChangeRequest?._id ?? "",
								deliverableIds: [...deliverableIds, job._id],
							});
						}}
					>
						{acceptMutation.isLoading ? <Spinner size={20} /> : "Reopen Job"}
					</Button>
					<Button
						fullWidth
						onClick={() => {
							declineMutation.mutate({
								reviewChangeRequestId: reviewChangeRequest?._id ?? "",
							});
						}}
						variant="secondary"
					>
						{declineMutation.isLoading ? <Spinner size={20} /> : "Decline Request"}
					</Button>
				</div>
			</div>
		</>
	);
};
