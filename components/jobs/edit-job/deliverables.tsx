import React from 'react';
import { Button } from 'pakt-ui';
import { Plus, X } from 'lucide-react';
import { useJobEditStore } from '@/lib/store/job-edit';

const MAX_DESCRIPTION_LENGTH = 400;

export const DescriptionAndDeliverables: React.FC = () => {
  const job = useJobEditStore((state) => state.job);
  const setJob = useJobEditStore((state) => state.setJob);

  const [description, setDescription] = React.useState<string>(job.description);
  const [deliverables, setDeliverables] = React.useState<string[]>(job.deliverables);

  const setActiveStep = useJobEditStore((state) => state.setActiveStep);

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
            value={description}
            onChange={(e) => {
              if (e.target.value.length > MAX_DESCRIPTION_LENGTH) return;
              setDescription(e.target.value);
            }}
            maxLength={400}
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

        <Deliverables deliverables={deliverables} setDeliverables={setDeliverables} />
      </div>

      <div className="flex justify-end">
        <div className="max-w-[200px] w-full">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => {
              setActiveStep('project');
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

interface DeliverablesProps {
  deliverables: string[];
  setDeliverables: React.Dispatch<React.SetStateAction<string[]>>;
}

const Deliverables: React.FC<DeliverablesProps> = ({ deliverables, setDeliverables }) => {
  const MAX_DELIVERABLES = 5;
  const deliverableListRef = React.useRef<HTMLDivElement>(null);

  const addDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const deleteDeliverable = (deliverableIndex: number) => {
    setDeliverables(deliverables.filter((d, index) => index !== deliverableIndex));
  };

  const editDeliverable = (deliverableIndex: number, newDeliverable: string) => {
    const updatedDeliverables = deliverables.map((d, index) => (index === deliverableIndex ? newDeliverable : d));
    setDeliverables(updatedDeliverables);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && deliverables.length < MAX_DELIVERABLES) {
      addDeliverable();

      if (deliverableListRef.current) {
        const newDeliverableIndex = deliverables.length;
        // wait for the new deliverable to be rendered
        setTimeout(() => {
          const newDeliverableInput = deliverableListRef.current?.children[newDeliverableIndex].querySelector('input');
          newDeliverableInput?.focus();
        }, 1);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2" ref={deliverableListRef}>
        {deliverables.map((deliverable, index) => {
          return (
            <div key={index} className="flex gap-2">
              <input
                key={index}
                value={deliverable}
                onKeyDown={handleKeyDown}
                onChange={(e) => editDeliverable(index, e.target.value)}
                type="text"
                className="w-full resize-none border border-line rounded-lg outline-none px-4 py-2 focus-within:border-secondary hover:border-secondary hover:duration-200"
              />
              <button
                type="button"
                onClick={() => deleteDeliverable(index)}
                className="flex justify-center items-center duration-200 bg-slate-50 hover:bg-gray-100 border border-line rounded-lg basis-[50px] shrink-0"
              >
                <X size={20} strokeWidth={2} className="text-title" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addDeliverable}
        disabled={deliverables.length === MAX_DELIVERABLES}
        className="text-base px-2 py-2 border border-primary border-opacity-30 text-primary text-center flex items-center justify-center rounded-lg bg-success bg-opacity-10 hover:bg-opacity-20 duration-200"
      >
        <div className="flex gap-2 items-center">
          <Plus size={18} strokeWidth={2} />
          <span>Add New Deliverable</span>
        </div>
      </button>
    </div>
  );
};
