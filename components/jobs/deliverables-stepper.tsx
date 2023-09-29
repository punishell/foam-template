import React from 'react';
import { format } from 'date-fns';
import { Spinner } from '@/components/common';
import { useMarkDeliverableAsComplete, useMarkJobAsComplete } from '@/lib/api/job';
import { Button } from 'pakt-ui';

interface Deliverable {
  jobId: string;
  progress: number; // 0 or 100
  updatedAt: string;
  description: string;
  deliverableId: string;
}

interface DeliverableProps extends Deliverable {
  isLast: boolean;
  isNext: boolean;

  totalDeliverables: number;
  completedDeliverables: number;
}

const DeliverableStep: React.FC<DeliverableProps> = ({
  jobId,
  isLast,
  isNext,
  updatedAt,
  progress,
  description,
  deliverableId,
  totalDeliverables,
  completedDeliverables,
}) => {
  const mutation = useMarkDeliverableAsComplete();
  const [isComplete, setIsComplete] = React.useState(progress === 100);

  return (
    <div className="flex gap-3 items-start py-3 relative w-full">
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
          if (!isNext) return;

          mutation.mutate(
            {
              jobId,
              deliverableId,
              totalDeliverables,
              completedDeliverables,
              isComplete: !isComplete,
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

        {isComplete && (
          <span className="text-xs text-green-500">Completed: {format(new Date(updatedAt), 'dd MMM yyyy h:mm a')}</span>
        )}
      </div>
    </div>
  );
};

interface DeliverablesStepperProps {
  jobId: string;
  deliverables: Deliverable[];
}

export const DeliverablesStepper: React.FC<DeliverablesStepperProps> = ({ deliverables, jobId }) => {
  const mutation = useMarkJobAsComplete();
  const totalDeliverables = deliverables.length;
  const completedDeliverables = deliverables.filter((deliverable) => deliverable.progress === 100).length;

  const isNext = (index: number) => {
    // if there is only one deliverable, it is always next
    if (totalDeliverables === 1) return true;

    // if none is completed, the first deliverable is the next
    if (completedDeliverables === 0) return index === 0;

    // if last item. is is always next
    if (index === totalDeliverables - 1) return true;

    // if previous deliverable is completed, it is next
    if (deliverables[index - 1].progress === 100) return true;

    return false;
  };

  return (
    <div className="flex flex-col w-full h-full grow">
      {deliverables.map(({ deliverableId, description, jobId, progress, updatedAt }, index) => {
        return (
          <DeliverableStep
            jobId={jobId}
            progress={progress}
            key={deliverableId}
            updatedAt={updatedAt}
            description={description}
            deliverableId={deliverableId}
            totalDeliverables={totalDeliverables}
            isNext={isNext(index)}
            isLast={index === totalDeliverables - 1}
            completedDeliverables={completedDeliverables}
          />
        );
      })}

      <div className="mt-auto">
        {totalDeliverables === completedDeliverables && (
          <Button
            size={'sm'}
            fullWidth
            onClick={() => {
              mutation.mutate(
                {
                  jobId,
                },
                {
                  onError: () => {
                    mutation.reset();
                  },
                },
              );
            }}
          >
            {mutation.isLoading ? <Spinner /> : 'Mark Job as Complete'}
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
