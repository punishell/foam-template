"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Star } from "lucide-react";
import Rating from "react-rating";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { useCreateJobReview, useReleaseJobPayment } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import { type Job } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface ReviewClientProps {
	job: Job;
	reviewChangeRequestCompleted: boolean;
	setRequestReviewChange: (value: boolean) => void;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewClientForm: FC<ReviewClientProps> = ({
	job,
	reviewChangeRequestCompleted,
	setRequestReviewChange,
}) => {
	const router = useRouter();

	const mutation = useCreateJobReview();
	const releasePaymentMutation = useReleaseJobPayment();
	const { _id: jobId, creator, owner } = job;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const clientReview = job.ratings?.find((review) => review.owner._id === job.creator._id);

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
						label: "Review Job",
						active: true,
					},
				]}
			/>
			<div className="flex h-[calc(100%-70px)] flex-col gap-4 p-4">
				{clientReview && clientReview.rating < 5 && !reviewChangeRequestCompleted && (
					<div className="xborder-line flex flex-col gap-3 rounded-xl border border-[#7DDE86] p-3">
						<div className="flex items-center justify-between">
							<span>
								{clientReview.owner.firstName} {clientReview.owner.lastName}&apos; Review
							</span>
							{/* @ts-expect-error --- Types Error */}
							<Rating
								readonly
								initialRating={clientReview.rating || 0}
								fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
								emptySymbol={<Star fill="transparent" color="#15D28E" />}
							/>
						</div>
						<p className="text-body">{clientReview.review}</p>
						<Button
							fullWidth
							size="sm"
							variant="secondary"
							onClick={() => {
								setRequestReviewChange(true);
							}}
							className="bg-transparent"
						>
							Request opportunity to improve
						</Button>
					</div>
				)}

				<h3 className="text-lg leading-[27px] tracking-wide">How was your experience with</h3>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<AfroProfile
							score={creator?.score || 0}
							size="sm"
							src={creator?.profileImage?.url}
							url={`/talents/${creator?._id}`}
						/>

						<div className="flex flex-col gap-1">
							<span className="text-base text-blue-950 font-bold leading-normal tracking-wide">{`${creator?.firstName} ${creator?.lastName}`}</span>
							<span className="text-xs capitalize leading-[18px] text-blue-950 tracking-wide">
								{creator?.profile.bio.title}
							</span>
						</div>
					</div>

					<div>
						{/* @ts-expect-error --- Types Error */}
						<Rating
							initialRating={rating}
							onChange={(value) => {
								setRating(value);
							}}
							fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
							emptySymbol={<Star fill="transparent" color="#15D28E" />}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<h3>Comment</h3>
					<div>
						<textarea
							rows={3}
							value={comment}
							onChange={(e) => {
								if (e.target.value.length <= MAX_COMMENT_LENGTH) {
									setComment(e.target.value);
								}
							}}
							placeholder="Write your comment..."
							className="w-full grow resize-none rounded-lg border border-line bg-white p-2 placeholder:text-sm focus:outline-none"
						/>
						<div className="ml-auto w-fit">
							<span className="text-sm text-body">{comment.length}</span>
							<span className="text-sm text-body">/</span>
							<span className="text-sm text-body">{MAX_COMMENT_LENGTH} characters</span>
						</div>
					</div>
				</div>
				<Button
					fullWidth
					disabled={mutation.isLoading || rating === 0 || comment.length === 0}
					onClick={() => {
						mutation.mutate(
							{
								rating,
								jobId,
								review: comment,
								recipientId: creator?._id ?? "",
							},
							{
								onSuccess: () => {
									releasePaymentMutation.mutate({
										jobId,
										owner: owner?._id,
									});
									router.push("/wallet");
								},
							},
						);
					}}
					className="mt-auto"
					variant="primary"
					size="lg"
				>
					{mutation.isLoading ? <Spinner size={20} /> : "Submit Review"}
				</Button>
			</div>
		</>
	);
};
