import React from 'react';
import { clsx } from 'clsx';
import { Checkbox } from 'pakt-ui';
import { LinearProgress } from 'pakt-ui';
import { useJobCreationStore } from '@/lib/store';

export const Steps: React.FC = () => {
  const stepsStatus = useJobCreationStore((state) => state.stepsStatus);
  const setActiveStep = useJobCreationStore((state) => state.setActiveStep);

  const completedSteps = Object.values(stepsStatus).filter((step) => step == 'complete').length;

  return (
    <div className="w-full flex flex-col gap-4">
      <span className="font-medium">Steps</span>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-body">{completedSteps} / 6 Completed</span>
        <LinearProgress value={50} />
      </div>

      <div className="flex flex-col gap-3">
        <StepSelector
          status={stepsStatus.details}
          onClick={() => {
            setActiveStep('details');
          }}
        >
          Job Details
        </StepSelector>

        <StepSelector
          status={stepsStatus.deliverables}
          onClick={() => {
            if (stepsStatus.details !== 'complete') return;
            setActiveStep('deliverables');
          }}
        >
          Deliverables
        </StepSelector>

        <StepSelector
          status={stepsStatus.project}
          onClick={() => {
            if (stepsStatus.deliverables !== 'complete') return;
            setActiveStep('project');
          }}
        >
          Job Type
        </StepSelector>

        <StepSelector
          status={stepsStatus.visibility}
          onClick={() => {
            if (stepsStatus.project !== 'complete') return;
            setActiveStep('visibility');
          }}
        >
          Visibility
        </StepSelector>

        <StepSelector
          status={stepsStatus.review}
          onClick={() => {
            if (stepsStatus.visibility !== 'complete') return;
            setActiveStep('review');
          }}
        >
          Review and Post
        </StepSelector>
      </div>
    </div>
  );
};

interface StepSelectorProps {
  status: 'complete' | 'active' | 'pending';
  onClick: () => void;
  children: React.ReactNode;
}

export const StepSelector: React.FC<StepSelectorProps> = ({ status, children, onClick }) => {
  return (
    <label
      onClick={onClick}
      className={clsx({
        'flex items-center gap-4 border rounded-lg py-3 px-3  duration-200 cursor-pointer': true,
        'border-primary border-opacity-50 hover:bg-primary hover:bg-opacity-10': status == 'complete',
        'border-primary border-opacity-50 bg-primary bg-opacity-10 hover:bg-opacity-20': status == 'active',
        'border-line bg-[#F7F7FC] hover:bg-primary hover:bg-opacity-10': status == 'pending',
      })}
    >
      <Checkbox checked={status == 'complete'} />
      <span>{children}</span>
    </label>
  );
};
