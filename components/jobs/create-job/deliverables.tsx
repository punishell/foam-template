import React from 'react';
import { Button } from 'pakt-ui';
import { useJobCreationStore } from '@/lib/store';
import { DeliverablesInput } from '@/components/jobs/deliverables-input';

const MAX_DESCRIPTION_LENGTH = 400;

export const DescriptionAndDeliverables: React.FC = () => {
  const job = useJobCreationStore((state) => state.job);
  const setJob = useJobCreationStore((state) => state.setJob);
  const gotoNextStep = useJobCreationStore((state) => state.gotoNextStep);

  const [description, setDescription] = React.useState<string>(job.description);
  const [deliverables, setDeliverables] = React.useState<string[]>(job.deliverables);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-6">
        <h3 className="text-black text-lg font-medium">2. Deliverables</h3>

        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-title">
            Job Description
          </label>
          <textarea
            rows={3}
            maxLength={MAX_DESCRIPTION_LENGTH}
            onChange={(e) => {
              if (e.target.value.length > MAX_DESCRIPTION_LENGTH) return;
              setDescription(e.target.value);
            }}
            value={description}
            className="w-full resize-none border border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200"
          />
          <span className="self-end text-sm">
            {description.length}/ {MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-title">Deliverables</span>
          <span className="text-sm text-body">You can add up to five deliverables for the job</span>
        </div>

        <DeliverablesInput deliverables={deliverables} setDeliverables={setDeliverables} />
      </div>

      <div className="flex justify-end">
        <div className="max-w-[200px] w-full">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={deliverables.length === 0 || description.length === 0}
            onClick={() => {
              if (deliverables.length === 0 || description.length === 0) return;
              gotoNextStep();
              setJob({ ...job, description, deliverables });
            }}
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};
