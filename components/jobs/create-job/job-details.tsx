import React from 'react';
import { X } from 'lucide-react';
import { useJobCreationStore } from '@/lib/store';
import { Select, SelectOption, Button } from 'pakt-ui';

export const JobDetails: React.FC = () => {
  const CATEGORY_OPTIONS: SelectOption[] = [];
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

        <TagInput />
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

const TagInput = () => {
  const [tags, setTags] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
    if (event.key === 'Backspace' && inputValue === '') {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border rounded-lg px-2 py-2 min-h-[50px] border-line hover:border-secondary peer-focus-within:border-secondary group-focus-within:border-secondary duration-200">
      {tags.map((tag) => (
        <div
          key={tag}
          className="inline-flex items-center gap-2 rounded-full border border-primary border-opacity-30 !bg-[#ECFCE5] px-3 py-1 text-sm text-[#198155]"
        >
          <span>{tag}</span>
          <button type="button" className="text-[#198155]" onClick={() => setTags(tags.filter((t) => t !== tag))}>
            <X size={16} strokeWidth={1} />
          </button>
        </div>
      ))}
      <input
        type="text"
        className="flex-grow outline-none peer"
        placeholder="Add a tag"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
