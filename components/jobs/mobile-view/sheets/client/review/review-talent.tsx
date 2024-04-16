"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Star } from "lucide-react";
import { Button } from "pakt-ui";
import Rating from "react-rating";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCreateJobReview } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import { type Job } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface ReviewTalentProps {
	job: Job;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewTalentForm: FC<ReviewTalentProps> = ({ job }) => {
	const router = useRouter();
	const mutation = useCreateJobReview();
	const { _id, owner } = job;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	return (
		<>
			<Breadcrumb
				items={[
					{
						label: "Jobs",
						action: () => {
							router.push("/jobs?skills=&search=&range=%2C100&jobs-type=created");
						},
					},
					{ label: "Review Job", active: true },
				]}
			/>
			<div className="bg-primary-gradient px-4 py-6 text-2xl font-bold text-white">
				<h3 className="break-words text-lg">Review</h3>
			</div>

			<div className="flex h-[calc(100%-70px)] flex-col gap-4 p-4">
				<h3 className="text-lg leading-[27px] tracking-wide">How was your experience with</h3>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<AfroProfile
							score={owner?.score ?? 0}
							size="sm"
							src={owner?.profileImage?.url}
							url={`/talents/${owner?._id}`}
						/>

						<div className="flex flex-col gap-1">
							<span className="text-base text-blue-950 font-bold leading-normal tracking-wide">{`${owner?.firstName} ${owner?.lastName}`}</span>
							<span className="text-xs capitalize leading-[18px] text-blue-950 tracking-wide">
								{owner?.profile.bio.title}
							</span>
						</div>
					</div>

					<div>
						{/* @ts-expect-error --- */}
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
							<span className="text-sm text-body">{MAX_COMMENT_LENGTH}</span>
						</div>
					</div>
				</div>

				<Button
					fullWidth
					onClick={() => {
						mutation.mutate(
							{
								rating,
								jobId: _id,
								review: comment,
								recipientId: owner?._id ?? "",
							},
							{
								onSuccess: () => {},
							},
						);
					}}
					className="mt-auto"
					type="button"
				>
					{mutation.isLoading ? <Spinner size={20} /> : "Submit Review"}
				</Button>
			</div>
		</>
	);
};
