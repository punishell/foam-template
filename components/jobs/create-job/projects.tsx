import clsx from 'clsx';
import React from 'react';
import { Button, Select } from 'pakt-ui';
import { Plus, X, ChevronRight } from 'lucide-react';
import { useJobCreationStore } from '@/lib/store';

export const Projects: React.FC = () => {
  const setActiveStep = useJobCreationStore((state) => state.setActiveStep);
  const setStepsStatus = useJobCreationStore((state) => state.setStepsStatus);

  const [jobType, setJobType] = React.useState<'freelance' | 'team-project'>();

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
              onClick={() => setJobType('team-project')}
              className={clsx({
                'flex flex-col gap-2 border border-line rounded-2xl p-4 text-left duration-200': true,
                'bg-[#ECFCE5] border-primary': jobType === 'team-project',
              })}
            >
              <span className="text-title font-medium">Project</span>
              <span className="text-sm text-body">
                Selecting private allows only talents you invite to view and participate on the job.
              </span>
            </button>
          </div>
        </div>

        {jobType === 'team-project' && <ChooseProject />}
      </div>

      <div className="flex justify-end">
        <div className="max-w-[200px] w-full">
          <Button
            disabled={!jobType}
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => {
              setActiveStep('visibility');
              setStepsStatus({ visibility: 'active' });
              setStepsStatus({ project: 'complete' });
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
