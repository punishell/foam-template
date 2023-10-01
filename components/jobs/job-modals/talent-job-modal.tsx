import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { isJobDeliverable, type Job } from '@/lib/types';
import Lottie from 'lottie-react';
import { useGetJobById } from '@/lib/api/job';
import success from '@/lottiefiles/success.json';
import { AfroProfile } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';
import { DeliverablesStepper } from '@/components/jobs/deliverables-stepper';
import { Spinner } from '@/components/common';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { Button } from 'pakt-ui';
import { ChevronLeft } from 'lucide-react';
import { useCreateJobReview } from '@/lib/api/job';
import Rating from 'react-rating';
import { Star } from 'lucide-react';
import { useReleaseJobPayment } from '@/lib/api/job';
import is from 'date-fns/locale/is/index';
interface TalentJobModalProps {
  jobId: string;
  closeModal?: () => void;
}

export const TalentJobModal: React.FC<TalentJobModalProps> = ({ jobId }) => {
  const query = useGetJobById({ jobId });

  if (query.isError) return <PageError className="absolute inset-0" />;

  if (query.isLoading) return <PageLoading className="absolute inset-0" />;

  const job = query.data;

  const clientHasReviewed = job.ratings?.some((review) => review.owner._id === job.creator._id);

  const talentHasReviewed = job.ratings?.some((review) => review.owner._id === job.owner?._id);

  if (clientHasReviewed && talentHasReviewed) {
    return <ReviewSuccess />;
  }

  if (clientHasReviewed && !talentHasReviewed) {
    return <ReviewClient job={job} />;
  }

  return <JobUpdates job={job} />;
};

interface JobUpdatesProps {
  job: Job;
}

const JobUpdates: React.FC<JobUpdatesProps> = ({ job }) => {
  const {
    name,
    creator,
    tags,
    description,
    createdAt,
    deliveryDate,
    paymentFee,
    collections,
    progress,
    _id: jobId,
  } = job;
  const deliverables = collections.filter(isJobDeliverable);

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-3xl">{name}</div>
      <div className="flex py-6 px-4 flex-col gap-6 h-full grow">
        <div className="flex flex-col gap-4">
          <table className="table-auto">
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '75%' }} />
            </colgroup>
            <tbody>
              <tr>
                <th className="py-2 text-left font-normal text-body">Date Created</th>
                <td className=" px-4 py-2">{format(new Date(createdAt), 'MMM dd, yyyy')}</td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Due Date</th>
                <td className=" px-4 py-2">{format(new Date(deliveryDate), 'MMM dd, yyyy')}</td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Price</th>
                <td className=" px-4 py-2">{paymentFee} USD</td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Status</th>
                <td className=" px-4 py-2">
                  <span className="px-3 text-sm text-title inline-flex rounded-full bg-[#B2E9AA66]">
                    {progress === 100 ? 'Completed' : 'In Progress'}
                  </span>
                </td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Client</th>
                <td className=" px-4 py-2">
                  <div className="flex gap-2 items-center">
                    <AfroProfile score={creator.score} size="sm">
                      <div className="h-full w-full rounded-full">
                        {creator.profileImage?.url ? (
                          <Image src={creator.profileImage?.url} fill alt="profile" className="rounded-full" />
                        ) : (
                          <DefaultAvatar />
                        )}
                      </div>
                    </AfroProfile>
                    <div className="flex flex-col">
                      <span className="text-title text-base font-bold">{`
                  ${creator.firstName} ${creator.lastName}
                  `}</span>
                      <span className="text-sm ">{creator.profile.bio.title}</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Skills</th>
                <td className=" px-4 py-2">
                  <div className="flex items-center gap-2 text-sm">
                    {tags.map(({ color, name }) => {
                      return (
                        <span
                          key={name}
                          className={`px-4 capitalize rounded-full py-0.5`}
                          style={{
                            backgroundColor: color,
                          }}
                        >
                          {name}
                        </span>
                      );
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Job Description</h3>
          <p className="bg-[#C9F0FF] p-3 rounded-xl border border-blue-300">{description}</p>
        </div>
        <div className="flex flex-col gap-2 grow">
          <div>
            <h3 className="font-bold text-lg">Job Deliverables</h3>
            <p className="text-body">Mark the deliverables as you&rsquo;re done with them</p>
          </div>

          <div className="grow h-full">
            <DeliverablesStepper
              jobId={jobId}
              deliverables={deliverables.map(({ _id, name, progress, updatedAt }) => ({
                jobId: jobId,
                progress,
                updatedAt,
                description: name,
                deliverableId: _id,
              }))}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const ReviewSuccess: React.FC = () => {
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
              <Button fullWidth size="sm">
                Go To Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReviewClientProps {
  job: Job;
  closeModal?: () => void;
}

const MAX_COMMENT_LENGTH = 500;

const ReviewClient: React.FC<ReviewClientProps> = ({ job, closeModal }) => {
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
