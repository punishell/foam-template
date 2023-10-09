import React from 'react';
import type { Job, UserProfile } from '@/lib/types';
import { isJobCancellation, isJobDeliverable } from '@/lib/types';
import { Button, Checkbox, Slider } from 'pakt-ui';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/common';
import { DeliverableProgressBar } from '@/components/common/deliverable-progress-bar';
import { useAcceptJobCancellation } from '@/lib/api/job';
import { useRequestJobCancellation } from '@/lib/api/job';
import { JobUpdateHeader } from '../job-update-header';
import Rating from 'react-rating';
import { Star } from 'lucide-react';
import { DeliverablesStepper } from '@/components/jobs/deliverables-stepper';
import Image from 'next/image';
import { AfroScore } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';

const MAX_REVIEW_LENGTH = 500;

interface ReviewJobCancellationRequestProps {
  job: Job;
  closeModal: () => void;
}

export const ReviewJobCancellationRequest: React.FC<ReviewJobCancellationRequestProps> = ({ job }) => {
  const [acceptCancellation, setAcceptCancellation] = React.useState(false);

  const {
    creator,
    owner,
    createdAt,
    paymentFee,
    deliveryDate,
    name: jobTitle,
    _id: jobId,
    progress,
    tags,
    collections,
  } = job;

  const deliverables = collections.filter(isJobDeliverable);
  const jobCancellation = job.collections.find(isJobCancellation);

  if (acceptCancellation) {
    return <AcceptJobCancellation job={job} client={creator} setAcceptCancellation={setAcceptCancellation} />;
  }

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-gradient-to-r from-danger via-red-500 to-red-400 text-white font-bold text-3xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{jobTitle}</span>
        </div>
      </div>
      <div className="flex py-6 px-4 flex-col gap-6 h-full grow">
        <JobUpdateHeader
          status="cancel_requested"
          createdAt={createdAt}
          profile={creator}
          deliveryDate={deliveryDate}
          paymentFee={paymentFee}
          progress={progress}
          tags={tags}
        />

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Explanation</h3>
          <div className="bg-[#FEF4E3] p-3 rounded-xl border border-yellow flex flex-col gap-2">
            <h3 className="font-bold">{jobCancellation?.name}</h3>
            <p>{jobCancellation?.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Deliverables</h3>

          <DeliverablesStepper
            jobId={jobId}
            jobCreator={creator._id}
            talentId={String(owner?._id)}
            readonly
            showActionButton={false}
            deliverables={deliverables.map(({ _id, name, progress, updatedAt }) => ({
              progress,
              updatedAt,
              jobId: jobId,
              description: name,
              deliverableId: _id,
              jobCreator: creator._id,
            }))}
          />
        </div>
        <div className="mt-auto border border-red-300 rounded-xl">
          <Button
            size={'sm'}
            fullWidth
            onClick={() => {
              setAcceptCancellation(true);
            }}
            variant={'danger'}
          >
            Review And Cancel Job
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

interface AcceptJobCancellationProps {
  job: Job;
  client: UserProfile;
  setAcceptCancellation: (value: boolean) => void;
}

const AcceptJobCancellation: React.FC<AcceptJobCancellationProps> = ({ setAcceptCancellation, client, job }) => {
  const cancelJobMutation = useAcceptJobCancellation();

  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [percentageToPay, setPercentageToPay] = React.useState(10);

  const amountToPay = (percentageToPay / 100) * job.paymentFee;

  const totalDeliverables = job.collections.filter(isJobDeliverable).length;

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-gradient-to-r from-danger via-red-500 to-red-400 text-white font-bold text-3xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAcceptCancellation(false);
            }}
          >
            <ChevronLeft />
          </button>
          <span>Cancel Job</span>
        </div>
      </div>

      <div className="flex py-6 px-4 flex-col gap-10 h-full grow">
        <DeliverableProgressBar
          percentageProgress={job.progress}
          totalDeliverables={totalDeliverables}
          className="max-w-none text-base"
        />

        <div className="flex flex-col gap-1">
          <p className="text-title">Proposed Job Price: ${job.paymentFee}</p>

          <div className="flex flex-col gap-3 p-3 bg-slate-50 rounded-lg border border-gray-200">
            <p className="text-body flex items-center gap-2">
              <span>Amount to pay the Talent:</span> <span className="text-green-600 font-bold">${amountToPay}</span>
              <span className="text-sm">({percentageToPay}%)</span>
            </p>
            <div className="my-2">
              <Slider
                value={[percentageToPay]}
                onValueChange={(value) => {
                  setPercentageToPay(value[0]);
                }}
                min={0}
                max={100}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-title">How was your experience with {client?.firstName}?</span>
          <div className="flex flex-col gap-3 p-3 bg-slate-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AfroScore score={client.score || 0} size="sm">
                  <div className="h-full w-full rounded-full relative">
                    {client.profileImage?.url ? (
                      <Image src={client.profileImage?.url} fill alt="profile" className="rounded-full" />
                    ) : (
                      <DefaultAvatar />
                    )}
                  </div>
                </AfroScore>

                <div className="flex flex-col gap-1">
                  <span className="text-title text-base font-medium leading-none">{`${client.firstName} ${client.lastName}`}</span>
                  <span className="text-sm capitalize leading-none">{client.profile.bio.title}</span>
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
        </div>

        <div>
          <h3>Comment</h3>
          <div>
            <textarea
              rows={5}
              value={comment}
              onChange={(e) => {
                if (e.target.value.length <= MAX_REVIEW_LENGTH) {
                  setComment(e.target.value);
                }
              }}
              placeholder="Write your comment..."
              className="grow focus:outline-none p-2 resize-none rounded-lg w-full bg-gray-50 border border-line placeholder:text-sm"
            ></textarea>
            <div className="ml-auto w-fit">
              <span className="text-sm text-body">{comment.length}</span>
              <span className="text-sm text-body">/</span>
              <span className="text-sm text-body">{MAX_REVIEW_LENGTH}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            fullWidth
            variant={'primary'}
            disabled={cancelJobMutation.isLoading || comment.length === 0 || rating === 0}
            onClick={() => {
              cancelJobMutation.mutate({
                rating,
                jobId: job._id,
                review: comment,
                amount: amountToPay,
                recipientId: client._id,
              });
            }}
          >
            {cancelJobMutation.isLoading ? <Spinner size={20} /> : 'Accept Cancellation'}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

const JOB_CANCEL_REASONS = ['Client is not responsive', 'Unforeseeable Circumstances'];

interface RequestJobCancellationProps {
  jobId: string;
  closeModal: () => void;
  cancelJobCancellationRequest: () => void;
}

export const RequestJobCancellation: React.FC<RequestJobCancellationProps> = ({
  closeModal,
  jobId,
  cancelJobCancellationRequest,
}) => {
  const requestJobCancellationMutation = useRequestJobCancellation();

  const [reason, setReason] = React.useState('');
  const [reasonNotInOptions, setReasonNotInOptions] = React.useState(false);
  const [explanation, setExplanation] = React.useState('');

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-3xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={cancelJobCancellationRequest}>
            <ChevronLeft />
          </button>
          <span>Cancel Job</span>
        </div>
      </div>

      <div className="flex py-6 px-4 flex-col gap-6 h-full grow">
        <div className="bg-[#FEF4E3]  p-4 rounded-2xl border border-yellow-dark">
          The client will need to accept for the cancellation to be effective. Ensure you have had the conversation with
          them.
        </div>

        <div className="flex flex-col gap-2">
          <h2>
            Reason for cancellation <span className="text-red-500">*</span>
          </h2>
          <div className="flex flex-col gap-3">
            {JOB_CANCEL_REASONS.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <Checkbox
                  checked={reason === option}
                  onCheckedChange={() => {
                    setReason(option);
                    setReasonNotInOptions(false);
                  }}
                />
                <span className="text-[#575767]">{option}</span>
              </label>
            ))}

            {
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={reasonNotInOptions}
                  onCheckedChange={() => {
                    if (!reasonNotInOptions) {
                      setReason('');
                    }
                    setReasonNotInOptions(true);
                  }}
                />
                <span className="text-[#575767]">Other</span>
              </label>
            }

            {reasonNotInOptions && (
              <textarea
                rows={2}
                value={reason}
                placeholder="Write your reason..."
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                className="grow focus:outline-none p-2 resize-none rounded-lg w-full bg-gray-50 border border-line placeholder:text-sm"
              ></textarea>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#FEF4E3]  p-4 rounded-2xl border border-yellow-dark">
            Payment for any deliverable is at the sole discretion of the client. Client will review talent but talent
            cannot review client.
          </div>

          <div className="flex flex-col gap-1">
            <h3>Explanation</h3>
            <div>
              <textarea
                rows={5}
                value={explanation}
                placeholder="Write your explanation..."
                onChange={(e) => {
                  setExplanation(e.target.value);
                }}
                className="grow focus:outline-none p-2 resize-none rounded-lg w-full bg-gray-50 border border-line placeholder:text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            fullWidth
            disabled={requestJobCancellationMutation.isLoading || reason.length === 0 || explanation.length === 0}
            onClick={() => {
              requestJobCancellationMutation.mutate({
                jobId,
                reason,
                explanation,
              });
            }}
          >
            {requestJobCancellationMutation.isLoading ? <Spinner size={20} /> : 'Request Cancellation'}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export const RequestJobCancellationSuccess: React.FC = () => {
  const router = useRouter();
  return (
    <div className="h-full px-4 flex items-center justify-center">
      <div className="flex flex-col gap-9 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="227" height="233" fill="none" viewBox="0 0 227 233">
          <g clipPath="url(#clip0_6827_46303)">
            <mask
              id="mask0_6827_46303"
              style={{ maskType: 'luminance' }}
              width="227"
              height="233"
              x="0"
              y="0"
              maskUnits="userSpaceOnUse"
            >
              <path fill="#fff" d="M226.75.97H.25v231.06h226.5V.97z"></path>
            </mask>
            <g mask="url(#mask0_6827_46303)">
              <path
                fill="#FFE5E5"
                d="M114.258 10.09c26.912 0 51.491 9.991 70.23 26.466 22.181 19.501 36.179 48.088 36.179 79.944 0 58.769-47.641 106.41-106.409 106.41-30.757 0-58.467-13.049-77.894-33.914C18.67 169.994 7.848 144.511 7.848 116.5c0-58.768 47.641-106.41 106.41-106.41z"
              ></path>
              <path
                fill="#fff"
                d="M162.015 103.111v41.134c0 4.976-4.04 9.016-9.016 9.016H75.942c-4.976 0-9.016-4.04-9.016-9.016v-41.134c0-4.976 4.04-9.016 9.016-9.016H153c4.976 0 9.016 4.04 9.016 9.016z"
              ></path>
              <path
                fill="#C2D3DD"
                d="M114.269 127.496a8.99 8.99 0 01-4.977-1.497L66.686 97.822a4.705 4.705 0 011.253-2.287 4.711 4.711 0 013.376-1.412h85.988a4.75 4.75 0 014.627 3.699l-42.691 28.181a8.992 8.992 0 01-4.97 1.493z"
              ></path>
              <path
                fill="#F7E7E7"
                d="M65.787 148.871l41.859-28.245a11.816 11.816 0 0113.223 0l41.859 28.245v.089a6.797 6.797 0 01-6.797 6.796H72.583a6.797 6.797 0 01-6.796-6.885z"
              ></path>
              <path
                fill="#FF6D6D"
                d="M114.266 128.506a8.794 8.794 0 01-4.977-1.545L66.682 97.885a4.904 4.904 0 011.254-2.361 4.638 4.638 0 013.376-1.457H157.3c2.257 0 4.15 1.635 4.627 3.817l-42.692 29.081a8.79 8.79 0 01-4.969 1.541zM157.3 96.393c.658 0 1.257.265 1.702.697l-41.008 27.934a6.601 6.601 0 01-3.729 1.156 6.6 6.6 0 01-3.733-1.159l-40.926-27.93a2.43 2.43 0 011.706-.698H157.3zm0-4.652H71.312c-3.9 0-7.048 3.291-6.997 7.316l43.73 29.844a11.017 11.017 0 006.22 1.931c2.164 0 4.329-.642 6.212-1.925l43.82-29.85v-.094c0-3.988-3.133-7.222-6.997-7.222z"
              ></path>
              <path
                fill="#D3180C"
                d="M157.3 96.393c.658 0 1.257.265 1.702.697l-41.008 27.934a6.601 6.601 0 01-3.729 1.156 6.6 6.6 0 01-3.733-1.159l-40.926-27.93a2.43 2.43 0 011.706-.698H157.3zm0-4.652H71.312c-3.9 0-7.048 3.291-6.997 7.316l43.73 29.844a11.017 11.017 0 006.22 1.931c2.164 0 4.329-.642 6.212-1.925l43.82-29.85v-.094c0-3.988-3.133-7.222-6.997-7.222z"
              ></path>
              <path
                fill="#D3180C"
                d="M155.968 96.377a3.828 3.828 0 013.823 3.823v47.801a3.827 3.827 0 01-3.823 3.823H72.555a3.828 3.828 0 01-3.824-3.823V100.2a3.828 3.828 0 013.824-3.823h83.413zm0-4.508H72.555a8.331 8.331 0 00-8.331 8.331v47.801a8.331 8.331 0 008.331 8.331h83.413a8.331 8.331 0 008.331-8.331V100.2c0-4.601-3.73-8.33-8.331-8.33z"
              ></path>
            </g>
          </g>
          <defs>
            <clipPath id="clip0_6827_46303">
              <path fill="#fff" d="M0 0H226.5V231.06H0z" transform="translate(.25 .97)"></path>
            </clipPath>
          </defs>
        </svg>
        <p className="text-lg text-body">A cancel request has been sent to the client.</p>
        <div className="max-w-[200px] w-full">
          <Button fullWidth size="sm" onClick={() => router.push('/overview')}>
            Go To Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
