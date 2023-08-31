import React from 'react';
import { useJobEditStore } from '@/lib/store/job-edit';
import { Select, SelectOption, Button } from 'pakt-ui';
import { TagInput } from '@/components/common/tag-input';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  title: z.string().nonempty({ message: 'Job title is required' }),
  category: z.string().nonempty({ message: 'Category is required' }),
  due: z.string().nonempty({ message: 'Due date is required' }),
  budget: z.number(),
  skills: z.array(z.string()).nonempty({ message: 'Skills are required' }),
});

type FormValues = z.infer<typeof schema>;

export const JobDetails: React.FC = () => {
  const job = useJobEditStore((state) => state.job);
  const setJob = useJobEditStore((state) => state.setJob);

  const CATEGORY_OPTIONS: SelectOption[] = [
    { label: 'Design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Product', value: 'product' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Copywriting', value: 'copywriting' },
    { label: 'Others', value: 'others' },
  ];

  const setActiveStep = useJobEditStore((state) => state.setActiveStep);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: job.title,
      category: job.category,
      due: job.due,
      budget: job.budget,
      skills: job.skills,
    },
  });

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
              {...form.register('title')}
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

            <Controller
              name="category"
              control={form.control}
              render={({ field: { onChange } }) => (
                <Select
                  options={CATEGORY_OPTIONS}
                  placeholder="Choose Category"
                  onChange={onChange}
                  className="!border-line hover:!border-secondary hover:duration-200"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="due" className="text-title">
              Due Date
            </label>
            <input
              {...form.register('due')}
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
              {...form.register('budget')}
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

        <Controller
          name="skills"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <TagInput tags={value} setTags={onChange} className="min-h-[50px]" />
          )}
        />
      </div>

      <div className="flex justify-end">
        <div className="max-w-[200px] w-full">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => {
              setActiveStep('deliverables');
              setJob({
                ...job,
                title: form.getValues('title'),
                category: form.getValues('category'),
                due: form.getValues('due'),
                budget: form.getValues('budget'),
                skills: form.getValues('skills'),
              });
            }}
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};
