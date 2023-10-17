import React from 'react';
import Image from 'next/image';
import { type Job, isReviewChangeRequest } from '@/lib/types';
import Lottie from 'lottie-react';
import success from '@/lottiefiles/success.json';
import { Spinner } from '@/components/common';
import { Button } from 'pakt-ui';
import { ChevronLeft } from 'lucide-react';
import { useCreateJobReview, useRequestReviewChange } from '@/lib/api/job';
import Rating from 'react-rating';
import { Star } from 'lucide-react';
import { useReleaseJobPayment } from '@/lib/api/job';
import { useRouter } from 'next/navigation';
import { AfroProfile } from '@/components/common/afro-profile';

interface ReviewClientProps {
  job: Job;
  closeModal: () => void;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewClient: React.FC<ReviewClientProps> = ({ job, closeModal }) => {
  const [requestReviewChange, setRequestReviewChange] = React.useState(false);

  const mutation = useCreateJobReview();
  const releasePaymentMutation = useReleaseJobPayment();
  const { _id: jobId, creator, owner } = job;
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const clientReview = job.ratings?.find((review) => review.owner._id === job.creator._id);

  const reviewChangeRequest = job.collections.find(isReviewChangeRequest);
  const reviewChangeRequestCompleted = reviewChangeRequest?.status === 'completed';
  const [reviewChangeRequestPending, setReviewChangeRequestPending] = React.useState(
    reviewChangeRequest?.status === 'pending',
  );

  if (reviewChangeRequestPending) {
    return <RequestJobChangeSuccess closeModal={closeModal} />;
  }

  if (requestReviewChange) {
    return (
      <RequestReviewChange
        job={job}
        setRequestReviewChange={setRequestReviewChange}
        setReviewChangeRequestPending={setReviewChangeRequestPending}
        jobId={jobId}
        recipientId={String(creator?._id)}
      />
    );
  }

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-2xl">
        <div className="flex items-center gap-2">
          <button onClick={closeModal}>
            <ChevronLeft />
          </button>
          <span>Review</span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-6 py-4 h-full">
        {clientReview && clientReview.rating < 5 && !reviewChangeRequestCompleted && (
          <div className="p-3 border xborder-line border-[#7DDE86] rounded-xl flex flex-col gap-3 bg-[#FBFFFA]">
            <div className="flex justify-between items-center">
              <span>
                {clientReview.owner.firstName} {clientReview.owner.lastName}&apos; Review
              </span>
              {/*  @ts-ignore */}
              <Rating
                readonly
                initialRating={clientReview.rating || 0}
                fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
                emptySymbol={<Star fill="transparent" color="#15D28E" />}
              />
            </div>
            <p className="text-body">{clientReview.review}</p>
            <Button fullWidth size={'xs'} variant={'secondary'} onClick={() => setRequestReviewChange(true)}>
              Request Changes
            </Button>
          </div>
        )}

        <div className="border p-3 rounded-xl bg-gray-50">
          <h3 className="text-lg">How was your experience with</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AfroProfile
                score={creator?.score || 0}
                size="md"
                src={creator?.profileImage?.url}
                url={`/talents/${creator?._id}`}
              />

              <div className="flex flex-col gap-1">
                <span className="text-title text-base font-medium leading-none">{`${creator?.firstName} ${creator?.lastName}`}</span>
                <span className="text-sm capitalize leading-none">{creator?.profile.bio.title}</span>
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

        <div className="border p-3 rounded-xl bg-gray-50 flex flex-col gap-1">
          <h3>Comment</h3>
          <div>
            <textarea
              rows={5}
              value={comment}
              onChange={(e) => {
                if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                  setComment(e.target.value);
                }
              }}
              placeholder="Write your comment..."
              className="grow focus:outline-none p-2 resize-none rounded-lg w-full bg-white border border-line placeholder:text-sm"
            ></textarea>
            <div className="ml-auto w-fit">
              <span className="text-sm text-body">{comment.length}</span>
              <span className="text-sm text-body">/</span>
              <span className="text-sm text-body">{MAX_COMMENT_LENGTH} characters</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            fullWidth
            disabled={mutation.isLoading || rating === 0 || comment.length === 0}
            onClick={() => {
              mutation.mutate(
                {
                  rating,
                  jobId: jobId,
                  review: comment,
                  recipientId: creator?._id ?? '',
                },
                {
                  onSuccess: () => {
                    releasePaymentMutation.mutate({
                      jobId: jobId,
                      owner: owner?._id,
                    });
                  },
                },
              );
            }}
          >
            {mutation.isLoading ? <Spinner size={20} /> : 'Submit Review'}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

interface RequestReviewChangeProps {
  job: Job;
  jobId: string;
  recipientId: string;
  setRequestReviewChange: (value: boolean) => void;
  setReviewChangeRequestPending: (value: boolean) => void;
}

const RequestReviewChange: React.FC<RequestReviewChangeProps> = ({
  job,
  jobId,
  recipientId,
  setRequestReviewChange,
  setReviewChangeRequestPending,
}) => {
  const mutation = useRequestReviewChange({ recipientId });
  const [reason, setReason] = React.useState('');

  const clientReview = job.ratings?.find((review) => review.owner._id === job.creator._id);

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRequestReviewChange(false);
            }}
          >
            <ChevronLeft />
          </button>
          <span>Review</span>
        </div>
      </div>
      <div className="flex py-6 px-4 flex-col gap-6 h-full grow">
        <div className="bg-[#FEF4E3] p-3 rounded-xl border border-yellow flex flex-col gap-2">
          Requesting to Improve will give the client the opportunity to Reopen the Job. After completion both parties
          will leave reviews.
        </div>

        <div>
          <div className="p-3 border border-line rounded-xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span>{clientReview?.owner.firstName}&apos; Review</span>
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
        </div>

        <div className="flex flex-col gap-1">
          <h3>
            Reason for requesting review change <span className="text-red-500">*</span>
          </h3>
          <div>
            <textarea
              rows={5}
              value={reason}
              placeholder="Write your explanation..."
              onChange={(e) => {
                setReason(e.target.value);
              }}
              className="grow focus:outline-none p-2 resize-none rounded-lg w-full bg-gray-50 border border-line placeholder:text-sm"
            ></textarea>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            fullWidth
            disabled={mutation.isLoading || reason.length === 0}
            onClick={() => {
              mutation.mutate(
                {
                  jobId,
                  reason,
                },
                {
                  onSuccess: () => {
                    setReviewChangeRequestPending(true);
                  },
                },
              );
            }}
          >
            {mutation.isLoading ? <Spinner size={20} /> : 'Submit Request'}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

const RequestJobChangeSuccess: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const router = useRouter();

  return (
    <div className="h-full px-4 flex items-center justify-center flex-col">
      <div className="flex flex-col gap-20 items-center justify-center h-fit">
        <div className="">
          <Image src="/images/logo-dark.svg" width={300} height={100} alt="logo" />
        </div>

        <div className="max-w-[200px]">
          <Lottie animationData={success} loop={false} />
        </div>
        <div className="flex flex-col text-center items-center  x-mt-40 gap-9">
          <div className="flex flex-col gap-9 text-center items-center">
            <p className="text-lg text-body max-w-[80%]">
              The Client has been notified and will have the opportunity to reopen the job.
            </p>
            <div className="max-w-[200px] w-full">
              <Button
                fullWidth
                size="sm"
                onClick={() => {
                  closeModal();
                  router.push('/overview');
                }}
              >
                Go To Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewSuccess: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const router = useRouter();

  return (
    <div className="h-full px-4 flex items-center justify-center flex-col">
      <div className="flex flex-col gap-20 items-center justify-center h-fit">
        <div className="">
          <Image src="/images/logo-dark.svg" width={300} height={100} alt="logo" />
        </div>

        <div className="max-w-[200px]">
          <Lottie animationData={success} loop={false} />
        </div>
        <div className="flex flex-col text-center items-center  x-mt-40 gap-9">
          <div className="flex flex-col gap-9 text-center items-center">
            <p className="text-lg text-body max-w-[80%]">Your review has submitted and payment has been released.</p>
            <div className="max-w-[200px] w-full">
              <Button
                fullWidth
                size="sm"
                onClick={() => {
                  closeModal();
                  router.push('/wallet');
                }}
              >
                Go To Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
