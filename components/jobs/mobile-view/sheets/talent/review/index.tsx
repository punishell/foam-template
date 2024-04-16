"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job, isReviewChangeRequest } from "@/lib/types";
import { RequestJobChangeSuccess } from "./request-job-change-success";
import { RequestReviewChange } from "./request-review-change";
import { ReviewClientForm } from "./review-client";

interface ReviewClientProps {
	job: Job;
	closeModal: () => void;
}

export const ReviewClient: FC<ReviewClientProps> = ({ job, closeModal }) => {
	const [requestReviewChange, setRequestReviewChange] = useState(false);

	const { _id: jobId, creator } = job;

	const reviewChangeRequest = job.collections.find(isReviewChangeRequest);
	const reviewChangeRequestCompleted = reviewChangeRequest?.status === "completed";
	const [reviewChangeRequestPending, setReviewChangeRequestPending] = useState(
		reviewChangeRequest?.status === "pending",
	);

	return reviewChangeRequestPending ? (
		<RequestJobChangeSuccess closeModal={closeModal} />
	) : requestReviewChange ? (
		<RequestReviewChange
			job={job}
			setRequestReviewChange={setRequestReviewChange}
			setReviewChangeRequestPending={setReviewChangeRequestPending}
			jobId={jobId}
			recipientId={String(creator?._id)}
		/>
	) : (
		<ReviewClientForm
			job={job}
			reviewChangeRequestCompleted={reviewChangeRequestCompleted}
			setRequestReviewChange={setRequestReviewChange}
		/>
	);
};
