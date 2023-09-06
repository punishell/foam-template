import clsx from 'clsx';
import React from 'react';
import { Button } from 'pakt-ui';
import { useJobEditStore } from '@/lib/store/job-edit';

export const Visibility: React.FC = () => {
  const job = useJobEditStore((state) => state.job);
  const setJob = useJobEditStore((state) => state.setJob);

  const gotoNextStep = useJobEditStore((state) => state.gotoNextStep);
  const [jobVisibility, setJobVisibility] = React.useState<'private' | 'public'>(job.visibility);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-6">
        <h3 className="text-black text-lg font-medium">4. Visibility</h3>

        <div className="flex flex-col gap-2">
          <span className="text-body">How do you want to get talents for this job</span>

          <div className="grid grid-cols-2 gap-6 h-[130px]">
            <button
              onClick={() => setJobVisibility('private')}
              className={clsx({
                'flex flex-col bg-[#FBFFF] gap-2 border border-[#7DDE86] rounded-2xl p-4 text-left duration-200': true,
              })}
            >
              <div className="flex gap-2 items-center">
                <RadioBox isChecked={jobVisibility === 'private'} />
                <span className="text-title font-medium">Private</span>
              </div>
              <span className="text-sm text-body">
                Selecting private allows only talents you invite to view and participate on the job.
              </span>
            </button>
            <button
              onClick={() => setJobVisibility('public')}
              className={clsx({
                'flex flex-col gap-2 bg-[#F1FBFF] border border-[#C9F0FF] rounded-2xl p-4 text-left duration-200': true,
              })}
            >
              <div className="flex items-center gap-2">
                <RadioBox isChecked={jobVisibility === 'public'} />
                <span className="text-title font-medium">Public</span>
              </div>
              <span className="text-sm text-body">
                Selecting public allows all talents on afrofund apply and you select the one that fits the Job.
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="max-w-[200px] w-full">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={!jobVisibility}
            onClick={() => {
              if (!jobVisibility) return;
              gotoNextStep();
              setJob({ ...job, visibility: jobVisibility });
            }}
          >
            Review
          </Button>
        </div>
      </div>
    </div>
  );
};

interface RadioBoxProps {
  isChecked?: boolean;
}

const RadioBox: React.FC<RadioBoxProps> = ({ isChecked }) => {
  return (
    <div
      className={clsx({
        'bg-[#E8E8E8] rounded-full w-[25px] h-[25px] relative duration-200': true,
        'bg-primary-gradient': isChecked,
      })}
    >
      <div className="absolute z-10 bg-[#E8E8E8] inset-[6px] rounded-full" />
    </div>
  );
};
