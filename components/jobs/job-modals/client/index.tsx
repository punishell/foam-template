import React from 'react';
import { useGetJobById } from '@/lib/api/job';
import { isJobCancellation } from '@/lib/types';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';

import { JobUpdates } from './job-update';
import { ReviewSuccess, ReviewTalent } from './review';
import { RequestJobCancellation, RequestJobCancellationSuccess, ReviewJobCancellationRequest } from './cancellation';

interface ClientJobModalProps {
  jobId: string;
  closeModal?: () => void;
}

export const ClientJobModal: React.FC<ClientJobModalProps> = ({ jobId, closeModal }) => {
  const query = useGetJobById({ jobId });
  const [isRequestingJobCancellation, setIsRequestingJobCancellation] = React.useState(false);

  if (isRequestingJobCancellation) {
    return (
      <RequestJobCancellation
        jobId={jobId}
        closeModal={() => setIsRequestingJobCancellation(false)}
        cancelJobCancellationRequest={() => setIsRequestingJobCancellation(false)}
      />
    );
  }

  if (query.isError) return <PageError className="absolute inset-0" />;

  if (query.isLoading) return <PageLoading className="absolute inset-0" />;

  const job = query.data;

  const jobCancellation = job.collections.find(isJobCancellation);
  const talentRequestedCancellation = jobCancellation?.creator._id === job.owner?._id;
  const clientRequestedCancellation = jobCancellation?.creator._id === job.creator._id;

  if (job.status === 'cancel_requested' && clientRequestedCancellation) {
    return <RequestJobCancellationSuccess />;
  }

  if (job.status === 'cancel_requested' && talentRequestedCancellation) {
    return <ReviewJobCancellationRequest jobId={jobId} closeModal={() => setIsRequestingJobCancellation(false)} />;
  }

  const clientHasReviewed = job.ratings?.some((review) => review.owner._id === job.creator._id);

  if (clientHasReviewed) {
    return <ReviewSuccess closeModal={closeModal} />;
  }

  if (job.status === 'completed') {
    return <ReviewTalent job={job} />;
  }

  return <JobUpdates job={job} requestJobCancellation={() => setIsRequestingJobCancellation(true)} />;
};
