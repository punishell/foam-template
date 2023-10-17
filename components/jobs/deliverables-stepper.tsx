import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Spinner } from '@/components/common';
import { useToggleDeliverableCompletion, useMarkJobAsComplete, useUpdateJobProgress } from '@/lib/api/job';
import { Button } from 'pakt-ui';
import dayjs from 'dayjs';

interface Deliverable {
  jobId: string;
  jobCreator: string;
  progress: number; // 0 or 100
  updatedAt: string;
  description: string;
  deliverableId: string;
  meta?: Record<string, any>;
}

interface DeliverableProps extends Deliverable {
  isLast: boolean;
  isClient?: boolean;

  totalDeliverables: number;
  completedDeliverables: number;
}

const DeliverableStep: React.FC<DeliverableProps> = ({
  jobId,
  jobCreator,
  isLast,
  isClient,
  updatedAt,
  progress,
  description,
  deliverableId,
  totalDeliverables,
  completedDeliverables,
}) => {
  const mutation = useToggleDeliverableCompletion({ description });
  const [isComplete, setIsComplete] = React.useState(progress === 100);
  useEffect(() => {
    console.log("progress-changed", progress, isComplete)
  }, [progress]);

  return (
    <div className="flex gap-3 items-start py-1 relative w-full">
      <div
        className="absolute top-0 left-3 translate-y-3 w-[2px] h-full"
        style={{
          display: isLast ? 'none' : 'block',
          background: isComplete ? '#4CD471' : '#E8E8E8',
        }}
      />

      <CheckButton
        isChecked={isComplete}
        onClick={() => {
          if (isClient) return;
          mutation.mutate(
            {
              jobId,
              deliverableId,
              totalDeliverables,
              completedDeliverables,
              isComplete: !isComplete,
              jobCreator,
              meta: {
                completedAt: !isComplete ? dayjs() : "",
              }
            },
            {
              onError: () => {
                mutation.reset();
                setIsComplete((prev) => !prev);
              },
            },
          );
          setIsComplete((prev) => !prev);
        }}
      />

      <div className=" bg-[#F7F9FA] border border-line p-2 rounded-lg text-body w-full">
        <p
          style={{
            textDecoration: isComplete ? 'line-through' : 'none',
          }}
        >
          {description}
        </p>

        {isComplete && updatedAt && (
          <span className="text-xs text-green-500">Completed: {format(new Date(updatedAt), 'dd MMM yyyy h:mm a')}</span>
        )}
      </div>
    </div>
  );
};

interface DeliverablesStepperProps {
  jobId: string;
  talentId: string;
  readonly?: boolean;
  jobCreator: string;
  jobProgress: number;
  showActionButton?: boolean;
  deliverables: Deliverable[];
}

export const DeliverablesStepper: React.FC<DeliverablesStepperProps> = ({
  jobId,
  jobCreator,
  talentId,
  jobProgress,
  deliverables,
  readonly: isClient,
  showActionButton = true,
}) => {
  const updateJobProgress = useUpdateJobProgress({ creatorId: jobCreator });
  const markJobAsComplete = useMarkJobAsComplete();
  const totalDeliverables = deliverables.length;
  const completedDeliverables = deliverables.filter((deliverable) => deliverable.progress === 100).length;
  console.log(deliverables)

  return (
    <div className="flex flex-col w-full h-full grow pb-6">
      {deliverables
        .sort((a, b) => b.progress - a.progress)
        .map(({ deliverableId, description, jobId, progress, meta }, index) => {
          return (
            <DeliverableStep
              jobId={jobId}
              jobCreator={jobCreator}
              isClient={isClient}
              progress={progress}
              key={deliverableId}
              updatedAt={meta?.completedAt}
              description={description}
              deliverableId={deliverableId}
              totalDeliverables={totalDeliverables}
              isLast={index === totalDeliverables - 1}
              completedDeliverables={completedDeliverables}
            />
          );
        })}

      <div className="mt-auto">
        {showActionButton && isClient && jobProgress === 100 && (
          <Button
            className="mt-6"
            size={'sm'}
            fullWidth
            onClick={() => {
              markJobAsComplete.mutate(
                {
                  jobId,
                  talentId,
                },
                {
                  onError: () => {
                    markJobAsComplete.reset();
                  },
                },
              );
            }}
          >
            {markJobAsComplete.isLoading ? <Spinner size={20} /> : 'Mark Job as Complete'}
          </Button>
        )}

        {showActionButton && !isClient && jobProgress === 100 && (
          <div className="bg-primary-gradient p-[1.5px] rounded-[10px] mt-6">
            <div className="bg-green-50 rounded-lg py-3 px-2">Waiting for Client to approve job as complete.</div>
          </div>
        )}

        {showActionButton && !isClient && jobProgress !== 100 && completedDeliverables == totalDeliverables && (
          <Button
            className="mt-6"
            size={'sm'}
            fullWidth
            onClick={() => {
              updateJobProgress.mutate(
                {
                  jobId,
                  progress: 100,
                },
                {
                  onError: () => {
                    updateJobProgress.reset();
                  },
                },
              );
            }}
          >
            {updateJobProgress.isLoading ? <Spinner size={20} /> : 'Complete Job'}
          </Button>
        )}
      </div>
    </div>
  );
};

interface SquareCheckMarkProps {
  isChecked: boolean;
  onClick: () => void;
}

const CheckButton: React.FC<SquareCheckMarkProps> = ({ isChecked, onClick: setIsChecked }) => {
  return (
    <button className="scale-[0.8]" onClick={setIsChecked}>
      {isChecked ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="5" fill="#007C5B" />
          <path d="M8 13L10.9167 16L16 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="1" y="1" width="22" height="22" rx="5" stroke="#4CD571" strokeWidth="2" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="5" fill="url(#paint0_linear_988_53583)" />
          <rect x="1" y="1" width="22" height="22" rx="5" stroke="#DADADA" strokeWidth="2" />
          <defs>
            <linearGradient id="paint0_linear_988_53583" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FCFCFC" />
              <stop offset="1" stopColor="#F8F8F8" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </button>
  );
};
