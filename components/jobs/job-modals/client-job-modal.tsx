import React from 'react';
import type { Job } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useGetJobById } from '@/lib/api/job';
import { AfroProfile } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';
import { DeliverablesStepper } from '@/components/jobs/deliverables-stepper';
import { Button } from 'pakt-ui';
import Rating from 'react-rating';
import { Star } from 'lucide-react';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { useCreateJobReview } from '@/lib/api/job';
import { Spinner } from '@/components/common';
import success from '@/lottiefiles/success.json';
import Lottie from 'lottie-react';

interface ClientJobModalProps {
  jobId: string;
  closeModal?: () => void;
}

export const ClientJobModal: React.FC<ClientJobModalProps> = ({ jobId }) => {
  const query = useGetJobById({ jobId });

  if (query.isError) return <PageError className="absolute inset-0" />;

  if (query.isLoading) return <PageLoading className="absolute inset-0" />;

  const job = query.data;

  const clientHasReviewed = job.ratings?.some((review) => review.owner._id === job.creator._id);

  if (clientHasReviewed) {
    return <ReviewSuccess />;
  }

  if (job.status === 'completed') {
    return <ReviewTalent job={job} />;
  }

  return <JobUpdates job={job} />;
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
            <p className="text-lg text-body">
              Your review has submitted. Talent will also review and payment will be released after.
            </p>
            <div className="max-w-[200px] w-full">
              <Button fullWidth>Go To Wallet</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface JobUpdatesProps {
  job: Job;
}

const JobUpdates: React.FC<JobUpdatesProps> = ({ job }) => {
  const { name, tags, description, createdAt, deliveryDate, paymentFee, collections, progress, _id, owner } = job;
  const deliverables = collections.filter((collection) => collection.type === 'deliverable');

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-2xl">{name}</div>
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
                <th className="py-2 text-left font-normal text-body">Talent</th>
                <td className=" px-4 py-2">
                  <div className="flex gap-2 items-center">
                    <AfroProfile score={owner?.score || 0} size="sm">
                      <div className="h-full w-full rounded-full">
                        {owner?.profileImage?.url ? (
                          <Image src={owner?.profileImage?.url} fill alt="profile" className="rounded-full" />
                        ) : (
                          <DefaultAvatar />
                        )}
                      </div>
                    </AfroProfile>
                    <div className="flex flex-col">
                      <span className="text-title text-base font-bold">{`
                  ${owner?.firstName} ${owner?.lastName}
                  `}</span>
                      <span className="text-sm ">{owner?.profile.bio.title}</span>
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
              jobId={_id}
              readonly
              deliverables={deliverables.map(({ _id, name, progress, updatedAt }) => ({
                progress,
                updatedAt,
                jobId: _id,
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

interface ReviewTalentProps {
  job: Job;
  closeModal?: () => void;
}

const MAX_COMMENT_LENGTH = 500;

const ReviewTalent: React.FC<ReviewTalentProps> = ({ job }) => {
  const mutation = useCreateJobReview();
  const { description, name, _id, owner } = job;
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-2xl">
        <div className="flex items-center gap-2">
          <ChevronLeft />
          <span>Review</span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-6 py-4 h-full">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-lg">Job Description</h3>
          <div className="bg-[#C9F0FF] p-3 rounded-xl border border-blue-300 flex flex-col gap-1">
            <h3 className="text-title text-base font-medium">{name}</h3>

            <p className="text-sm">{description}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg">How was your experience with</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AfroProfile score={owner?.score || 0} size="sm">
                <div className="h-full w-full rounded-full relative">
                  {owner?.profileImage?.url ? (
                    <Image src={owner?.profileImage?.url} fill alt="profile" className="rounded-full" />
                  ) : (
                    <DefaultAvatar />
                  )}
                </div>
              </AfroProfile>

              <div className="flex flex-col gap-1">
                <span className="text-title text-base font-medium leading-none">{`${owner?.firstName} ${owner?.lastName}`}</span>
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
            onClick={() => {
              mutation.mutate(
                {
                  rating,
                  jobId: _id,
                  review: comment,
                  recipientId: owner?._id ?? '',
                },
                {
                  onSuccess: () => {},
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
