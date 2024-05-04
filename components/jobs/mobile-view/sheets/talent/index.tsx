"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { isJobCancellation } from "@/lib/types";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import warning from "@/lottiefiles/warning.json";
import { JobUpdates } from "./update";
import { ReviewClient } from "./review";
import { ReviewSuccess } from "./review/review-success";
import { ReviewJobCancellationRequest } from "./cancel/review-job-cancellation-request";
import { RequestJobCancellation } from "./cancel/request-job-cancellation";
import { JobCancellationRequested } from "./cancel/job-cancellation-request-success";
import { Button } from "@/components/common/button";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface TalentJobModalProps {
    jobId: string;
    talentId: string;
    closeModal: () => void;
    extras?: string;
}

export const TalentJobSheetForMobile: FC<TalentJobModalProps> = ({
    jobId,
    talentId,
    closeModal,
    extras,
}) => {
    const router = useRouter();
    const query = useGetJobById({ jobId, extras });
    const [isRequestingJobCancellation, setIsRequestingJobCancellation] =
        useState(false);

    if (query.isError) return <PageError className="absolute inset-0" />;

    if (query.isLoading)
        return <PageLoading className="absolute inset-0" color="#007C5B" />;

    const job = query.data;

    if (isRequestingJobCancellation) {
        return (
            <RequestJobCancellation
                jobId={jobId}
                talentId={talentId}
                closeModal={() => {
                    setIsRequestingJobCancellation(false);
                }}
                cancelJobCancellationRequest={() => {
                    setIsRequestingJobCancellation(false);
                }}
                type="cancellation"
            />
        );
    }

    const jobCancellation = job.collections.find(isJobCancellation);

    const talentRequestedCancellation =
        jobCancellation?.creator._id === job.owner?._id; // problem here
    const clientRequestedCancellation =
        jobCancellation?.creator._id === job.creator._id;

    const talentHasReviewed = job.ratings?.some(
        (review) => review.owner._id === job.owner?._id
    );
    const clientHasReviewed = job.ratings?.some(
        (review) => review.owner._id === job.creator._id
    );

    if (job.status === "cancelled") {
        return (
            <>
                <Breadcrumb
                    items={[
                        {
                            label: "Jobs",
                            action: () => {
                                closeModal();
                            },
                        },
                        {
                            label: "Create Job",
                            active: true,
                            action: () => {
                                router.push("/jobs/create");
                            },
                        },
                    ]}
                />
                <div className="flex h-full flex-col items-center justify-center bg-red-50 text-red-500">
                    <div className="flex w-[200px] items-center justify-center">
                        <Lottie animationData={warning} loop={false} />
                    </div>
                    <span>This Job has been cancelled</span>
                    <div className="mt-8 w-full max-w-[200px]">
                        <Button
                            fullWidth
                            size="lg"
                            onClick={() => {
                                closeModal();
                                router.push("/overview");
                            }}
                            variant="primary"
                        >
                            Go To Dashboard
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    if (jobCancellation && clientRequestedCancellation) {
        return (
            <ReviewJobCancellationRequest
                job={job}
                closeModal={() => {
                    setIsRequestingJobCancellation(false);
                }}
            />
        );
    }

    if (jobCancellation && talentRequestedCancellation) {
        return <JobCancellationRequested closeModal={closeModal} />;
    }

    if (clientHasReviewed && talentHasReviewed) {
        return <ReviewSuccess closeModal={closeModal} />;
    }

    if (clientHasReviewed && !talentHasReviewed) {
        return <ReviewClient job={job} closeModal={closeModal} />;
    }

    return (
        <JobUpdates
            job={job}
            requestJobCancellation={() => {
                setIsRequestingJobCancellation(true);
            }}
            closeModal={closeModal}
        />
    );
};
