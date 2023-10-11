import React from 'react';
import { Plus, Trash, Trash2, X } from 'lucide-react';

interface DeliverablesProps {
  deliverables: string[];
  setDeliverables: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DeliverablesInput: React.FC<DeliverablesProps> = ({ deliverables, setDeliverables }) => {
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
              <div className="w-full border-line rounded-lg pr-16 border hover:border-secondary hover:duration-200 relative">
                <input
                  key={index}
                  value={deliverable}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => editDeliverable(index, e.target.value)}
                  type="text"
                  maxLength={120}
                  className="w-full resize-none rounded-lg outline-none px-4 py-2 focus-within:border-secondary"
                />
                <div className="absolute right-0 top-0 bottom-0 rounded-lg flex items-center justify-center text-sm text-body w-[64px]">
                  {deliverable.length}/120
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteDeliverable(index)}
                className="flex justify-center items-center duration-200 bg-slate-50 hover:bg-gray-100 border border-line rounded-lg basis-[50px] shrink-0"
              >
                <Trash2 size={20} strokeWidth={2} className="text-danger" />
              </button>
            </div>
          );
        })}
      </div>

      {deliverables.length < MAX_DELIVERABLES && (
        <button
          type="button"
          onClick={addDeliverable}
          disabled={deliverables.length === MAX_DELIVERABLES}
          className="text-base px-2 py-2 border border-primary border-opacity-30 text-primary text-center flex items-center justify-center rounded-lg bg-success bg-opacity-10 hover:bg-opacity-20 duration-200 disabled:opacity-50"
        >
          <div className="flex gap-2 items-center">
            <Plus size={18} strokeWidth={2} />
            <span>Add New Deliverable</span>
          </div>
        </button>
      )}
    </div>
  );
};
