import React from 'react';
import { useGetJobById } from '@/lib/api/job';
import { isJobCancellation } from '@/lib/types';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import Lottie from 'lottie-react';
import warning from '@/lottiefiles/warning.json';

import { JobUpdates } from './job-update';
import { ReviewClient, ReviewSuccess } from './review';
import { RequestJobCancellation, ReviewJobCancellationRequest, JobCancellationRequested } from './cancellation';

interface TalentJobModalProps {
  jobId: string;
  talentId: string;
  closeModal: () => void;
}

export const TalentJobModal: React.FC<TalentJobModalProps> = ({ jobId, talentId, closeModal }) => {
  const query = useGetJobById({ jobId });
  const [isRequestingJobCancellation, setIsRequestingJobCancellation] = React.useState(false);

  if (isRequestingJobCancellation) {
    return (
      <RequestJobCancellation
        jobId={jobId}
        talentId={talentId}
        closeModal={() => setIsRequestingJobCancellation(false)}
        cancelJobCancellationRequest={() => setIsRequestingJobCancellation(false)}
      />
    );
  }

  if (query.isError) return <PageError className="absolute inset-0" />;

  if (query.isLoading) return <PageLoading className="absolute inset-0" />;

  const job = query.data;

  const jobCancellation = job.collections.find(isJobCancellation);

  const talentRequestedCancellation = jobCancellation?.creator._id === job.owner?._id; // problem here
  const clientRequestedCancellation = jobCancellation?.creator._id === job.creator._id;

  const talentHasReviewed = job.ratings?.some((review) => review.owner._id === job.owner?._id);
  const clientHasReviewed = job.ratings?.some((review) => review.owner._id === job.creator._id);

  if (job.status === 'cancelled') {
    return (
      <div className="bg-red-50 flex items-center justify-center h-full text-red-500 flex-col">
        <div className="w-[200px] flex items-center justify-center">
          <Lottie animationData={warning} loop={false} />
        </div>
        <span>This Job has been cancelled</span>
      </div>
    );
  }

  if (jobCancellation && clientRequestedCancellation) {
    return <ReviewJobCancellationRequest job={job} closeModal={() => setIsRequestingJobCancellation(false)} />;
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

  return <JobUpdates job={job} requestJobCancellation={() => setIsRequestingJobCancellation(true)} />;
};
