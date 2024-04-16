"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job, isReviewChangeRequest } from "@/lib/types";
import { ReviewChangeRequested } from "./review-change-requested";
import { ReviewSuccess } from "./review-success";
import { ReviewTalentForm } from "./review-talent";

interface ReviewTalentProps {
    job: Job;
    closeModal: () => void;
}

export const ReviewTalent: FC<ReviewTalentProps> = ({ job, closeModal }) => {
    const reviewChangeRequest = job.collections.find(isReviewChangeRequest);

    const reviewChangeRequestPending =
        reviewChangeRequest?.status === "pending";
    const clientHasReviewed = job.ratings?.some(
        (review) => review.owner._id === job.creator._id
    );

    return reviewChangeRequestPending ? (
        <ReviewChangeRequested job={job} />
    ) : clientHasReviewed ? (
        <ReviewSuccess closeModal={closeModal} />
    ) : (
        <ReviewTalentForm job={job} />
    );
};
