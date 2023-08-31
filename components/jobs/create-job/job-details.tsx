import React from 'react';
import { X } from 'lucide-react';
import { useJobCreationStore } from '@/lib/store';
import { Select, SelectOption, Button } from 'pakt-ui';
import { TagInput } from '@/components/common/tag-input';
export const JobDetails: React.FC = () => {
  const CATEGORY_OPTIONS: SelectOption[] = [];
  const [skills, setSkills] = React.useState<string[]>([]);
  const [categoryList, setCategoryList] = React.useState<string[]>([]);

  const setActiveStep = useJobCreationStore((state) => state.setActiveStep);
  const setStepsStatus = useJobCreationStore((state) => state.setStepsStatus);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-6">
        <h3 className="text-black text-lg font-medium">1. Job Details</h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-title">
              Job TItle
            </label>
            <input
              type="text"
              id="title"
              placeholder="Frontend Developer"
              className="w-full border border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-title">
              Category
            </label>
            <Select
              // id="category"
              options={CATEGORY_OPTIONS}
              placeholder="Choose Category"
              onChange={() => {}}
              className="!border-line hover:!border-secondary hover:duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="due" className="text-title">
              Due Date
            </label>
            <input
              type="text"
              id="due"
              placeholder="Frontend Developer"
              className="w-full border border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="budget" className="text-title">
              Proposed Budget
            </label>
            <input
              type="text"
              id="budget"
              placeholder="500"
              className="w-full border border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-black text-lg font-medium">Skill Sets</span>
          <span className="text-body text-sm">Select three</span>
        </div>

        <TagInput tags={skills} setTags={setSkills} />
      </div>

      <div className="flex justify-end">
        <div className="max-w-[200px] w-full">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => {
              setActiveStep('deliverables');
              setStepsStatus({ details: 'complete' });
              setStepsStatus({ deliverables: 'active' });
            }}
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};
