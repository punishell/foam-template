import React from 'react';
import { clsx } from 'clsx';
import { Checkbox } from 'pakt-ui';
import { LinearProgress } from 'pakt-ui';
import { uniqueItems } from '@/lib/utils';
import { useJobCreationStore } from '@/lib/store';

export const Steps: React.FC = () => {
  const gotoStep = useJobCreationStore((state) => state.gotoStep);
  const isActiveStep = useJobCreationStore((state) => state.isActiveStep);
  const completedSteps = useJobCreationStore((state) => state.completedSteps);
  const isCompletedStep = useJobCreationStore((state) => state.isCompletedStep);

  return (
    <div className="w-full flex flex-col gap-4">
      <span className="font-medium">Steps</span>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-body">{uniqueItems(completedSteps).length} / 5 Completed</span>
        <LinearProgress value={(uniqueItems(completedSteps).length / 5) * 100} />
      </div>

      <div className="flex flex-col gap-3">
        <StepSelector
          isActive={isActiveStep('details')}
          onClick={() => gotoStep('details')}
          isCompleted={isCompletedStep('details')}
        >
          Job Details
        </StepSelector>

        <StepSelector
          isActive={isActiveStep('deliverables')}
          onClick={() => gotoStep('deliverables')}
          isCompleted={isCompletedStep('deliverables')}
        >
          Deliverables
        </StepSelector>

        <StepSelector
          isActive={isActiveStep('project')}
          onClick={() => gotoStep('project')}
          isCompleted={isCompletedStep('project')}
        >
          Job Type
        </StepSelector>

        <StepSelector
          isActive={isActiveStep('visibility')}
          onClick={() => gotoStep('visibility')}
          isCompleted={isCompletedStep('visibility')}
        >
          Visibility
        </StepSelector>

        <StepSelector
          isActive={isActiveStep('review')}
          onClick={() => gotoStep('review')}
          isCompleted={isCompletedStep('review')}
        >
          Review and Post
        </StepSelector>
      </div>
    </div>
  );
};

interface StepSelectorProps {
  isActive: boolean;
  onClick: () => void;
  isCompleted: boolean;
  children: React.ReactNode;
}

export const StepSelector: React.FC<StepSelectorProps> = ({ children, onClick, isActive, isCompleted: isComplete }) => {
  return (
    <label
      onClick={onClick}
      className={clsx(
        'flex items-center gap-4 border rounded-lg py-3 px-3  duration-200 cursor-pointer border-primary border-opacity-50 hover:bg-primary hover:bg-opacity-10',
        {
          'border-primary border-opacity-50 bg-primary bg-opacity-10 hover:bg-opacity-20': isActive,
        },
      )}
    >
      <Checkbox checked={isComplete} />
      <span>{children}</span>
    </label>
  );
};
