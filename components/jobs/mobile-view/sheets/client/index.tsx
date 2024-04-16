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
import { JobUpdates } from "./update";
import warning from "@/lottiefiles/warning.json";
import { ReviewTalent } from "./review";
import { JobCancellationRequest } from "./cancel/review-job-cancellation-request";
import { RequestJobCancellation } from "./cancel/request-job-cancellation";
import { JobCancellationSuccessRequested } from "./cancel/job-cancellation-request-success";
import { Button } from "@/components/common/button";

interface ClientJobModalProps {
	jobId: string;
	talentId: string;
	closeModal: () => void;
	extras?: string;
}

export const ClientJobModalForMobile: FC<ClientJobModalProps> = ({ jobId, talentId, closeModal, extras }) => {
	const router = useRouter();
	const query = useGetJobById({ jobId, extras });
	const [isRequestingJobCancellation, setIsRequestingJobCancellation] = useState(false);

	if (query.isError) return <PageError className="absolute inset-0" />;

	if (query.isLoading) return <PageLoading className="absolute inset-0" color="#007C5B" />;

	const job = query.data;

	if (isRequestingJobCancellation) {
		return (
			<RequestJobCancellation
				jobId={jobId}
				closeModal={() => {
					setIsRequestingJobCancellation(false);
				}}
				cancelJobCancellationRequest={() => {
					setIsRequestingJobCancellation(false);
				}}
				talentId={talentId}
				type="cancellation"
			/>
		);
	}

	const jobCancellation = job.collections.find(isJobCancellation);
	const talentRequestedCancellation = jobCancellation?.creator._id === job.owner?._id;
	const clientRequestedCancellation = jobCancellation?.creator._id === job.creator._id;

	if (job.status === "cancelled") {
		return (
			<div className="flex h-full flex-col items-center justify-center bg-red-50 text-red-500">
				<div className="flex w-[200px] items-center justify-center">
					<Lottie animationData={warning} loop={false} />
				</div>
				<span>This Job has been cancelled</span>
				<div className="w-full max-w-[200px] mt-8">
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
		);
	}

	if (jobCancellation && talentRequestedCancellation) {
		return (
			<JobCancellationRequest
				job={job}
				closeModal={() => {
					setIsRequestingJobCancellation(false);
				}}
			/>
		);
	}

	if (jobCancellation && clientRequestedCancellation) {
		return <JobCancellationSuccessRequested closeModal={closeModal} />;
	}

	if (job.status === "completed") {
		return <ReviewTalent job={job} closeModal={closeModal} />;
	}

	return (
		<JobUpdates
			job={job}
			requestJobCancellation={() => {
				setIsRequestingJobCancellation(true);
			}}
		/>
	);
};
