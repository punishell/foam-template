import React from 'react';
import { Button } from 'pakt-ui';
import { Plus, X } from 'lucide-react';
import { useJobCreationStore } from '@/lib/store';

export const DescriptionAndDeliverables: React.FC = () => {
  const setActiveStep = useJobCreationStore((state) => state.setActiveStep);
  const setStepsStatus = useJobCreationStore((state) => state.setStepsStatus);

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
            maxLength={400}
            className="w-full resize-none border border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200"
          />
          <span className="self-end text-sm">0 / 400</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-title">Deliverables</span>
          <span className="text-sm text-body">You can add up to five deliverables for the job</span>
        </div>

        <Deliverables />
      </div>

      <div className="flex justify-end">
        <div className="max-w-[200px] w-full">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => {
              setActiveStep('project');
              setStepsStatus({ project: 'active' });
              setStepsStatus({ deliverables: 'complete' });
            }}
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};

const Deliverables = () => {
  const MAX_DELIVERABLES = 5;
  const [deliverables, setDeliverables] = React.useState(['']);
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
