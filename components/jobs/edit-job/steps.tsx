import React from 'react';
import { clsx } from 'clsx';
import { Checkbox } from 'pakt-ui';
import { LinearProgress } from 'pakt-ui';
import { useJobEditStore } from '@/lib/store/job-edit';

export const Steps: React.FC = () => {
  const activeStep = useJobEditStore((state) => state.activeStep);
  const setActiveStep = useJobEditStore((state) => state.setActiveStep);

  return (
    <div className="w-full flex flex-col gap-4">
      <span className="font-medium">Steps</span>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-body">{6} / 6 Completed</span>
        <LinearProgress value={100} />
      </div>

      <div className="flex flex-col gap-3">
        <StepSelector isActive={activeStep == 'details'} onClick={() => setActiveStep('details')}>
          Job Details
        </StepSelector>

        <StepSelector isActive={activeStep == 'deliverables'} onClick={() => setActiveStep('deliverables')}>
          Deliverables
        </StepSelector>

        <StepSelector isActive={activeStep == 'project'} onClick={() => setActiveStep('project')}>
          Job Type
        </StepSelector>

        <StepSelector isActive={activeStep == 'visibility'} onClick={() => setActiveStep('visibility')}>
          Visibility
        </StepSelector>

        <StepSelector isActive={activeStep == 'review'} onClick={() => setActiveStep('review')}>
          Review and Post
        </StepSelector>
      </div>
    </div>
  );
};

interface StepSelectorProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const StepSelector: React.FC<StepSelectorProps> = ({ children, onClick, isActive }) => {
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
      <Checkbox checked />
      <span>{children}</span>
    </label>
  );
};
