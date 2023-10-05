import React from 'react';
import Image from 'next/image';
import { type Job } from '@/lib/types';
import Lottie from 'lottie-react';
import success from '@/lottiefiles/success.json';
import { AfroProfile } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';
import { Spinner } from '@/components/common';
import { Button } from 'pakt-ui';
import { ChevronLeft } from 'lucide-react';
import { useCreateJobReview } from '@/lib/api/job';
import Rating from 'react-rating';
import { Star } from 'lucide-react';
import { useReleaseJobPayment } from '@/lib/api/job';
import { useRouter } from 'next/navigation';

interface ReviewClientProps {
  job: Job;
  closeModal?: () => void;
}

const MAX_COMMENT_LENGTH = 500;

export const ReviewClient: React.FC<ReviewClientProps> = ({ job, closeModal }) => {
  const mutation = useCreateJobReview();
  const releasePaymentMutation = useReleaseJobPayment();
  const { _id: jobId, creator } = job;
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const clientReview = job.ratings?.find((review) => review.owner._id === job.creator._id);

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
        {clientReview && (
          <div className="p-3 border border-line rounded-xl flex flex-col gap-3">
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
            <Button fullWidth size={'xs'} variant={'secondary'}>
              Request Changes
            </Button>
          </div>
        )}

        <div>
          <h3 className="text-lg">How was your experience with</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AfroProfile score={creator?.score || 0} size="sm">
                <div className="h-full w-full rounded-full relative">
                  {creator?.profileImage?.url ? (
                    <Image src={creator?.profileImage?.url} fill alt="profile" className="rounded-full" />
                  ) : (
                    <DefaultAvatar />
                  )}
                </div>
              </AfroProfile>

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

        <div>
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
              className="grow focus:outline-none p-2 resize-none rounded-lg w-full bg-gray-50 border border-line placeholder:text-sm"
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

export const ReviewSuccess: React.FC = () => {
  const router = useRouter();
  return (
    <div className="h-full px-4 flex items-center justify-center">
      <div className="flex flex-col gap-32 items-center">
        <div>
          <Image src="/images/logo-dark.svg" width={300} height={100} alt="logo" />
        </div>
        <div className="flex flex-col text-center items-center">
          <div className="max-w-[200px] -mb-4">
            <Lottie animationData={success} loop={false} />
          </div>
          <div className="flex flex-col gap-4 text-center items-center">
            <p className="text-lg text-body">Your review has submitted and payment has been released.</p>
            <div className="max-w-[200px] w-full">
              <Button fullWidth size="sm" onClick={() => router.push('/wallet')}>
                Go To Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
