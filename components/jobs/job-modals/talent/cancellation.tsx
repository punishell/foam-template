import React from 'react';
import { Button, Checkbox } from 'pakt-ui';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/common';
import { useRequestJobCancellation } from '@/lib/api/job';

interface ReviewJobCancellationRequestProps {
  jobId: string;
  closeModal: () => void;
}

export const ReviewJobCancellationRequest: React.FC<ReviewJobCancellationRequestProps> = ({ jobId, closeModal }) => {
  return <div>TODO</div>;
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
