import React from 'react';
import { useGetJobById } from '@/lib/api/job';
import { isJobCancellation } from '@/lib/types';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { JobUpdates } from './job-update';
import Lottie from 'lottie-react';
import warning from '@/lottiefiles/warning.json';
import { ReviewTalent } from './review';
import { RequestJobCancellation, JobCancellationRequest, JobCancellationSuccessRequested } from './cancellation';

interface ClientJobModalProps {
  jobId: string;
  talentId: string;
  closeModal: () => void;
}

export const ClientJobModal: React.FC<ClientJobModalProps> = ({ jobId, talentId, closeModal }) => {
  const query = useGetJobById({ jobId });
  const [isRequestingJobCancellation, setIsRequestingJobCancellation] = React.useState(false);

  if (isRequestingJobCancellation) {
    return (
      <RequestJobCancellation
        jobId={jobId}
        closeModal={() => setIsRequestingJobCancellation(false)}
        cancelJobCancellationRequest={() => setIsRequestingJobCancellation(false)}
        talentId={talentId}
      />
    );
  }

  if (query.isError) return <PageError className="absolute inset-0" />;

  if (query.isLoading) return <PageLoading className="absolute inset-0" />;

  const job = query.data;

  const jobCancellation = job.collections.find(isJobCancellation);
  const talentRequestedCancellation = jobCancellation?.creator._id === job.owner?._id;
  const clientRequestedCancellation = jobCancellation?.creator._id === job.creator._id;

  if (talentRequestedCancellation) {
    return <JobCancellationRequest job={job} closeModal={() => setIsRequestingJobCancellation(false)} />;
  }

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

  if (job.status === 'completed') {
    return <ReviewTalent job={job} closeModal={closeModal} />;
  }

  if (clientRequestedCancellation) {
    return <JobCancellationSuccessRequested />;
  }

  return <JobUpdates job={job} requestJobCancellation={() => setIsRequestingJobCancellation(true)} />;
};
