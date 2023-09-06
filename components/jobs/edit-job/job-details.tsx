import React from 'react';
import { endOfYesterday } from 'date-fns';
import { useJobEditStore } from '@/lib/store/job-edit';
import { Select, SelectOption, Button } from 'pakt-ui';
import { TagInput } from '@/components/common/tag-input';
import { DatePicker } from '@/components/common/date-picker';
import { NumericInput } from '@/components/common/numeric-input';

import * as z from 'zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const CATEGORY_OPTIONS: SelectOption[] = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Copywriting', value: 'copywriting' },
  { label: 'Others', value: 'others' },
];

const schema = z.object({
  title: z.string().nonempty({ message: 'Job title is required' }),
  category: z.string().nonempty({ message: 'Category is required' }),
  due: z.date({
    required_error: 'Due date is required',
  }),
  budget: z.string().nonempty({ message: 'Budget is required' }),
  skills: z.array(z.string()).nonempty({ message: 'Skills are required' }),
});

type FormValues = z.infer<typeof schema>;

export const JobDetails: React.FC = () => {
  const job = useJobEditStore((state) => state.job);
  const setJob = useJobEditStore((state) => state.setJob);

  const gotoNextStep = useJobEditStore((state) => state.gotoNextStep);

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

  const onSubmit: SubmitHandler<FormValues> = ({ budget, category, due, skills, title }) => {
    setJob({
      ...job,
      due,
      title,
      budget,
      skills,
      category,
    });

    gotoNextStep();
  };

  return (
    <form
      className="flex flex-col w-full gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
    >
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

            <span>
              {form.formState.errors.title?.message && (
                <span className="text-sm text-red-500">{form.formState.errors.title?.message}</span>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-title">
              Category
            </label>

            <Controller
              name="category"
              control={form.control}
              render={({ field: { onChange, value } }) => {
                return (
                  <div className="relative">
                    <Select
                      value={value}
                      onChange={onChange}
                      options={CATEGORY_OPTIONS}
                      className="!border-line hover:!border-secondary hover:duration-200 focus:outline-none focus:ring-0"
                    />

                    {!value && (
                      <div className="absolute inset-0 flex items-center justify-start px-4 pointer-events-none">
                        <span className="text-gray-400">Choose Category</span>
                      </div>
                    )}
                  </div>
                );
              }}
            />

            <span>
              {form.formState.errors.category?.message && (
                <span className="text-sm text-red-500">{form.formState.errors.category?.message}</span>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="due" className="text-title">
              Due Date
            </label>
            <Controller
              name="due"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  selected={value}
                  onSelect={(date) => onChange(date)}
                  disabled={(date) => date < endOfYesterday()}
                />
              )}
            />

            <span>
              {form.formState.errors.due?.message && (
                <span className="text-sm text-red-500">{form.formState.errors.due?.message}</span>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="budget" className="text-title">
              Proposed Budget
            </label>
            <Controller
              control={form.control}
              name="budget"
              render={({ field: { onChange, value } }) => (
                <NumericInput
                  value={value}
                  setValue={onChange}
                  id="budget"
                  placeholder="500"
                  className="w-full border border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200"
                />
              )}
            />

            <span>
              {form.formState.errors.budget?.message && (
                <span className="text-sm text-red-500">{form.formState.errors.budget?.message}</span>
              )}
            </span>
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

        <span>
          {form.formState.errors.skills?.message && (
            <span className="text-sm text-red-500">{form.formState.errors.skills?.message}</span>
          )}
        </span>
      </div>

      <div className="flex justify-end">
        <div className="max-w-[200px] w-full">
          <Button variant="primary" size="sm" fullWidth disabled={!form.formState.isValid}>
            Next Step
          </Button>
        </div>
      </div>
    </form>
  );
};
