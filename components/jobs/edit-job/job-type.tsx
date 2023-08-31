import clsx from 'clsx';
import React from 'react';
import { Button, Select } from 'pakt-ui';
import { ChevronRight } from 'lucide-react';
import { useJobEditStore } from '@/lib/store/job-edit';

export const JobType: React.FC = () => {
  const job = useJobEditStore((state) => state.job);
  const setJob = useJobEditStore((state) => state.setJob);

  const setActiveStep = useJobEditStore((state) => state.setActiveStep);
  const [jobType, setJobType] = React.useState<'freelance' | 'project'>(job.type);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-6">
        <h3 className="text-black text-lg font-medium">3. Job Type</h3>

        <div className="flex flex-col gap-2">
          <span className="text-body">Is this a freelance Job or a part of a project</span>

          <div className="grid grid-cols-2 gap-6 h-[130px]">
            <button
              onClick={() => setJobType('freelance')}
              className={clsx({
                'flex flex-col gap-2 border border-line rounded-2xl p-4 text-left duration-200': true,
                'bg-[#ECFCE5] border-primary': jobType === 'freelance',
              })}
            >
              <span className="text-title font-medium">Freelance</span>
              <span className="text-sm text-body">
                Selecting public allows all talents on afrofund apply and you select the one that fits the Job.
              </span>
            </button>
            <button
              onClick={() => setJobType('project')}
              className={clsx({
                'flex flex-col gap-2 border border-line rounded-2xl p-4 text-left duration-200': true,
                'bg-[#ECFCE5] border-primary': jobType === 'project',
              })}
            >
              <span className="text-title font-medium">Project</span>
              <span className="text-sm text-body">
                Selecting private allows only talents you invite to view and participate on the job.
              </span>
            </button>
          </div>
        </div>

        {jobType === 'project' && <ChooseProject />}
      </div>

      <div className="flex justify-end">
        <div className="max-w-[200px] w-full">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => {
              setActiveStep('visibility');
              setJob({ ...job, type: jobType });
            }}
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};

const ChooseProject = () => {
  return (
    <div className="bg-[#FCFCFC] p-6 border border-line rounded-lg flex flex-col gap-2">
      <label htmlFor="project" className="text-body">
        Choose from your list of projects or create one
      </label>
      <Select
        options={[]}
        placeholder="Choose Project"
        onChange={() => {}}
        className="!border-line hover:!border-secondary hover:duration-200"
      />

      <button className="flex items-center gap-2 self-end text-sm text-primary">
        <span>Create Project</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
