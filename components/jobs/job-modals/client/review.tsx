import React from "react";
import { type Job, isReviewChangeRequest, isJobDeliverable } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "pakt-ui";
import Rating from "react-rating";
import { Star } from "lucide-react";
import { useCreateJobReview } from "@/lib/api/job";
import { Spinner } from "@/components/common";
import success from "@/lottiefiles/success.json";
import Lottie from "lottie-react";
import { useDeclineReviewChange, useAcceptReviewChange } from "@/lib/api/job";
import { AfroProfile } from "@/components/common/afro-profile";

interface ReviewTalentProps {
    job: Job;
    closeModal: () => void;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewTalent: React.FC<ReviewTalentProps> = ({ job, closeModal }) => {
    const mutation = useCreateJobReview();
    const { description, name, _id, owner } = job;
    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState("");

    const reviewChangeRequest = job.collections.find(isReviewChangeRequest);

    const reviewChangeRequestPending = reviewChangeRequest?.status === "pending";
    const clientHasReviewed = job.ratings?.some((review) => review.owner._id === job.creator._id);

    if (reviewChangeRequestPending) {
        return <ReviewChangeRequested job={job} closeModal={closeModal} />;
    }

    if (clientHasReviewed) {
        return <ReviewSuccess closeModal={closeModal} />;
    }

    return (
        <React.Fragment>
            <div className="bg-primary-gradient px-4 py-6 text-2xl font-bold text-white">
                <div className="flex items-center gap-2">
                    <button onClick={closeModal}>
                        <ChevronLeft />
                    </button>
                    <span>Review</span>
                </div>
            </div>

            <div className="flex h-full flex-col gap-6 px-4 py-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium">Job Description</h3>
                    <div className="flex flex-col gap-1 rounded-xl border border-blue-300 bg-[#C9F0FF] p-3">
                        <h3 className="text-base font-medium text-title">{name}</h3>

                        <p className="text-sm">{description}</p>
                    </div>
                </div>

                <div className="rounded-xl border bg-gray-50 p-3">
                    <h3 className="text-lg">How was your experience with</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AfroProfile
                                score={owner?.score || 0}
                                size="md"
                                src={owner?.profileImage?.url}
                                url={`/talents/${owner?._id}`}
                            />

                            <div className="flex flex-col gap-1">
                                <span className="text-base font-medium leading-none text-title">{`${owner?.firstName} ${owner?.lastName}`}</span>
                                <span className="text-sm capitalize leading-none">{owner?.profile.bio.title}</span>
                            </div>
                        </div>

                        <div>
                            {/* @ts-ignore */}
                            <Rating
                                initialRating={rating}
                                onChange={(value) => setRating(value)}
                                fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
                                emptySymbol={<Star fill="transparent" color="#15D28E" />}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border bg-gray-50 p-3">
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
                        ></textarea>
                        <div className="ml-auto w-fit">
                            <span className="text-sm text-body">{comment.length}</span>
                            <span className="text-sm text-body">/</span>
                            <span className="text-sm text-body">{MAX_COMMENT_LENGTH}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
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
                    >
                        {mutation.isLoading ? <Spinner size={20} /> : "Submit Review"}
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};

interface ReviewChangeRequestedProps {
    job: Job;
    closeModal?: () => void;
}

const ReviewChangeRequested: React.FC<ReviewChangeRequestedProps> = ({ closeModal, job }) => {
    const acceptMutation = useAcceptReviewChange({ jobId: job._id, recipientId: String(job.owner?._id) });
    const declineMutation = useDeclineReviewChange({ jobId: job._id, recipientId: String(job.owner?._id) });

    const reviewChangeRequest = job.collections.find(isReviewChangeRequest);
    const talent = job.owner;
    const clientReview = job.ratings?.find((review) => review.owner._id === job.creator._id);

    const deliverableIds = job.collections.filter(isJobDeliverable).map((deliverable) => deliverable._id);

    return (
        <React.Fragment>
            <div className="bg-primary-gradient px-4 py-6 text-2xl font-bold text-white">
                <div className="flex items-center gap-2">
                    <button onClick={closeModal}>
                        <ChevronLeft />
                    </button>
                    <span>Request To Improve</span>
                </div>
            </div>
            <div className="flex h-full flex-col gap-6 px-4 py-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium">Job Description</h3>
                    <div className="flex flex-col gap-1 rounded-xl border border-blue-300 bg-[#C9F0FF] p-3">
                        <h3 className="text-sm font-medium text-title">{job.name}</h3>
                        <p className="text-sm">{job.description}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium">Talent Comment</h3>
                    <div className="flex flex-col gap-1 rounded-xl  border border-yellow-dark bg-[#FEF4E3] p-3">
                        <p className="text-lg text-body">{reviewChangeRequest?.description}</p>

                        <div className="flex items-center gap-2">
                            <AfroProfile
                                score={talent?.score || 0}
                                size="md"
                                src={talent?.profileImage?.url}
                                url={`/talents/${talent?._id}`}
                            />

                            <div className="flex flex-col gap-1">
                                <span className="text-base font-medium leading-none text-title">{`${talent?.firstName} ${talent?.lastName}`}</span>
                                <span className="text-sm capitalize leading-none">{talent?.profile.bio.title}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-slate-50 p-3">
                    <div className="flex w-full items-center justify-between">
                        <h3 className="text-sm font-medium text-title">Your review</h3>

                        {/*  @ts-ignore */}
                        <Rating
                            readonly
                            initialRating={clientReview?.rating || 0}
                            fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
                            emptySymbol={<Star fill="transparent" color="#15D28E" />}
                        />
                    </div>
                    <p className="text-body">{clientReview?.review}</p>
                </div>

                <div className="ml-auto mt-auto flex w-full max-w-[70%] items-center gap-3">
                    <Button
                        fullWidth
                        onClick={() => {
                            declineMutation.mutate({
                                reviewChangeRequestId: reviewChangeRequest?._id ?? "",
                            });
                        }}
                        variant={"secondary"}
                    >
                        {declineMutation.isLoading ? <Spinner size={20} /> : "Decline Request"}
                    </Button>
                    <div className="w-full rounded-xl border border-green-400">
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
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const ReviewSuccess: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
    return (
        <div className="flex h-full flex-col items-center justify-center px-4">
            <div className="flex h-fit flex-col items-center justify-center gap-20">
                <div className="">
                    <Image src="/images/logo-dark.svg" width={300} height={100} alt="logo" />
                </div>

                <div className="max-w-[200px]">
                    <Lottie animationData={success} loop={false} />
                </div>
                <div className="x-mt-40 flex flex-col items-center  gap-9 text-center">
                    <div className="flex flex-col items-center gap-9 text-center">
                        <p className="max-w-[80%] text-lg text-body">
                            Your review has been submitted. Payment will be released after talent has submitted their
                            review.
                        </p>
                        <div className="w-full max-w-[200px]">
                            <Button fullWidth size="sm" onClick={closeModal}>
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
