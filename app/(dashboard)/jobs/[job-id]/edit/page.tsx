'use client';
import React from 'react';
import { Job } from '@/lib/types';
import { useGetJobById } from '@/lib/api/job';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { useRouter } from 'next/navigation';
import { Button } from 'pakt-ui';
import { useDropzone } from 'react-dropzone';
import { useUpdateJob } from '@/lib/api/job';
import { Spinner } from '@/components/common';
import { endOfYesterday, format } from 'date-fns';
import { NumericInput } from '@/components/common/numeric-input';
import { DatePicker } from '@/components/common/date-picker';
import { DeliverablesInput } from '@/components/jobs/deliverables-input';
import { DollarSign } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/common/select';

interface Props {
  params: {
    'job-id': string;
  };
}

const CATEGORY_OPTIONS = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Copywriting', value: 'copywriting' },
  { label: 'Others', value: 'others' },
];

import * as z from 'zod';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { StepIndicator } from '@/components/jobs/step-indicator';

const schema = z.object({
  due: z.date({
    required_error: 'Due date is required',
  }),
  jobType: z.string().nonempty({ message: 'Required' }),
  visibility: z.string().nonempty({ message: 'Required' }),
  thirdSkill: z.string().optional().default(''),
  secondSkill: z.string().optional().default(''),
  firstSkill: z.string().nonempty({ message: 'At least, one skill is required' }),
  budget: z.string().nonempty({ message: 'Budget is required' }),
  title: z.string().nonempty({ message: 'Job title is required' }),
  description: z.string().nonempty({ message: 'Job description is required' }),
  category: z.string().nonempty({ message: 'Required' }),
  deliverables: z
    .array(z.string(), {
      required_error: 'At least, one deliverable is required',
    })
    .max(5, {
      message: 'You can add up to 5 deliverables',
    }),
});

type FormValues = z.infer<typeof schema>;

export default function EditJob({ params }: Props) {
  const jobId = params['job-id'];
  const jobData = useGetJobById({ jobId });

  if (jobData.isError) return <PageError className="absolute inset-0" />;
  if (jobData.isLoading) return <PageLoading className="absolute inset-0" />;
  const { data: job } = jobData;

  return <JobEditForm job={job} />;
}

type SkillInputProps = React.ComponentPropsWithRef<'input'>;

const SkillInput = React.forwardRef<HTMLInputElement, SkillInputProps>(({ ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      type="text"
      placeholder="Enter Skill"
      className="bg-[#F2F4F5] py-3 rounded-full pl-4 h-full text-base focus:outline-none w-fit border border-line"
    />
  );
});

SkillInput.displayName = 'SkillInput';

interface JobEditFormProps {
  job: Job;
}

const JobEditForm: React.FC<JobEditFormProps> = ({ job }) => {
  const router = useRouter();
  const updateJob = useUpdateJob();
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => { }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 5,
    accept: {},
  });

  const form = useForm<FormValues>({
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      budget: job.paymentFee.toString(),
      deliverables: job.collections
        .filter((collection) => collection.type === 'deliverable')
        .map((collection) => collection.name),
      title: job?.name,
      jobType: 'freelance',
      category: job?.category,
      description: job?.description,
      due: new Date(job?.deliveryDate),
      firstSkill: job?.tagsData[0] || '',
      thirdSkill: job?.tagsData[2] || '',
      secondSkill: job?.tagsData[1] || '',
      visibility: job?.isPrivate ? 'private' : 'public',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async ({
    budget,
    category,
    deliverables,
    description,
    due,
    firstSkill,
    jobType,
    title,
    visibility,
    secondSkill,
    thirdSkill,
  }) => {
    updateJob.mutate(
      {
        id: job._id,
        name: title,
        tags: [firstSkill, secondSkill, thirdSkill].filter(Boolean),
        category,
        description,
        deliverables,
        paymentFee: Number(budget),
        isPrivate: visibility === 'private',
        deliveryDate: format(due, 'yyyy-MM-dd'),
      },
      {
        onSuccess(_data, { id }) {
          form.reset();
          router.push(`/jobs/${id}`);
        },
      },
    );
  };

  return (
    <div className="flex gap-6 overflow-y-auto pb-10">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        className="border grow bg-white rounded-2xl flex flex-col h-fit"
      >
        <div className="bg-primary-gradient p-6 pb-8 rounded-t-2xl flex flex-col gap-10">
          <div className="relative">
            <input
              type="text"
              {...form.register('title')}
              placeholder="Enter Job Title"
              className="text-3xl w-full placeholder:text-white placeholder:text-opacity-60 bg-transparent focus:outline-none text-white caret-white"
            />
            <span className="absolute -bottom-5 flex w-full">
              {form.formState.errors.title?.message && (
                <span className="text-sm text-red-500">{form.formState.errors.title?.message}</span>
              )}
            </span>
          </div>

          <div className="flex gap-4 max-w-lg">
            <div className="relative">
              <div className="bg-[#C9F0FF] text-[#0065D0CC] flex items-center p-2 rounded-lg h-[45px]">
                <DollarSign />
                <NumericInput
                  type="text"
                  {...form.register('budget')}
                  placeholder="Enter Proposed Price"
                  className="bg-transparent  placeholder:text-[#0065D04D] h-full text-xl focus:outline-none"
                />
              </div>
              <span className="absolute -bottom-5 flex w-full">
                {form.formState.errors.budget?.message && (
                  <span className="text-sm text-red-500">{form.formState.errors.budget?.message}</span>
                )}
              </span>
            </div>
            <div className="relative">
              <Controller
                name="due"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    className="bg-[#ECFCE5] border-[#198155] text-primary h-[45px]"
                    placeholder="Select Due Date"
                    selected={value}
                    onSelect={(date) => onChange(date)}
                    disabled={(date) => date < endOfYesterday()}
                  />
                )}
              />
              <span className="absolute -bottom-5 flex w-full">
                {form.formState.errors.due?.message && (
                  <span className="text-sm text-red-500">{form.formState.errors.due?.message}</span>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h3 className="text-black text-lg font-medium">Preferred Skills</h3>
            <div className="flex gap-2 items-center justify-start">
              <div className="relative">
                <SkillInput {...form.register('firstSkill')} />
                <span className="absolute -bottom-6 flex w-full">
                  {form.formState.errors.firstSkill?.message && (
                    <span className="text-sm text-red-500">{form.formState.errors.firstSkill?.message}</span>
                  )}
                </span>
              </div>
              <div className="relative">
                <SkillInput {...form.register('secondSkill')} />
                <span className="absolute -bottom-6 flex w-full">
                  {form.formState.errors.secondSkill?.message && (
                    <span className="text-sm text-red-500">{form.formState.errors.secondSkill?.message}</span>
                  )}
                </span>
              </div>
              <div className="relative">
                <SkillInput {...form.register('thirdSkill')} />
                <span className="absolute -bottom-6 flex w-full">
                  {form.formState.errors.thirdSkill?.message && (
                    <span className="text-sm text-red-500">{form.formState.errors.thirdSkill?.message}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-black text-lg font-medium">Job Description</h3>
            <div className="relative">
              <textarea
                id="description"
                {...form.register('description')}
                className="bg-[#C9F0FF] rounded-lg w-full p-4 focus:outline-none border border-blue-300"
                placeholder="Enter Job Description"
              />
              <span className="absolute -bottom-4 flex w-full">
                {form.formState.errors.description?.message && (
                  <span className="text-sm text-red-500">{form.formState.errors.description?.message}</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-black text-lg font-medium">Deliverables</h3>

            <div className="relative">
              <Controller
                name="deliverables"
                control={form.control}
                render={({ field: { onChange, value = [] } }) => (
                  <DeliverablesInput deliverables={value} setDeliverables={onChange} />
                )}
              />
              <span className="absolute -bottom-6 flex w-full">
                {form.formState.errors.deliverables?.message && (
                  <span className="text-sm text-red-500">{form.formState.errors.deliverables?.message}</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-black text-lg font-medium">Classifications</h3>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-body">Job Category</label>
                <div className="relative">
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Select defaultValue={value} onValueChange={onChange}>
                          <SelectTrigger className="w-[180px] bg-[#F2F4F5] text-title text-base h-10 rounded-lg">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORY_OPTIONS.map(({ label, value }) => (
                              <SelectItem key={value} value={value} className="hover:bg-[#ECFCE5] rounded py-2">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  <span className="absolute -bottom-5 flex w-full">
                    {form.formState.errors.category?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.category?.message}</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-body">Visibility</label>
                <div className="relative">
                  <Controller
                    name="visibility"
                    control={form.control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Select defaultValue={value} onValueChange={onChange}>
                          <SelectTrigger className="w-[180px] bg-[#F2F4F5] text-title text-base h-10 rounded-lg">
                            <SelectValue placeholder="Select Visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private" className="hover:bg-[#ECFCE5] rounded py-2">
                              Private
                            </SelectItem>
                            <SelectItem value="open" className="hover:bg-[#ECFCE5] rounded py-2">
                              Public
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  <span className="absolute -bottom-5 flex w-full">
                    {form.formState.errors.visibility?.message && (
                      <span className="text-sm text-red-500 whitespace-nowrap">
                        {form.formState.errors.visibility?.message}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-body">Job Type</label>
                <div className="relative">
                  <Controller
                    name="jobType"
                    control={form.control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Select defaultValue={value} onValueChange={onChange}>
                          <SelectTrigger className="w-[180px] bg-[#F2F4F5] text-title text-base h-10 rounded-lg">
                            <SelectValue placeholder="Select Job Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="freelance" className="hover:bg-[#ECFCE5] rounded py-2">
                              Freelance
                            </SelectItem>
                            <SelectItem value="project" className="hover:bg-[#ECFCE5] rounded py-2">
                              Project
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  <span className="absolute -bottom-5 flex w-full">
                    {form.formState.errors.jobType?.message && (
                      <span className="text-sm text-red-500 whitespace-nowrap">
                        {form.formState.errors.jobType?.message}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-auto max-w-[250px] w-full">
            <Button fullWidth>{updateJob.isLoading ? <Spinner /> : 'Update Job'}</Button>
          </div>
        </div>
      </form>
      <div className="basis-[300px] shrink-0 grow-0 flex flex-col gap-6 ">
        <div className="bg-white p-6 rounded-xl min-h-[300px] border border-line flex flex-col gap-3">
          <h3 className="font-bold">Steps</h3>
          <StepIndicator
            isComplete={
              !form.getFieldState('title').invalid &&
              !form.getFieldState('due').invalid &&
              !form.getFieldState('budget').invalid
            }
          >
            Job Details
          </StepIndicator>
          <StepIndicator isComplete={!form.getFieldState('firstSkill').invalid}>Skills</StepIndicator>
          <StepIndicator isComplete={!form.getFieldState('description').invalid}>Description</StepIndicator>
          <StepIndicator isComplete={!form.getFieldState('deliverables').invalid}>Deliverables</StepIndicator>
          <StepIndicator
            isComplete={
              !form.getFieldState('jobType').invalid &&
              !form.getFieldState('visibility').invalid &&
              !form.getFieldState('category').invalid
            }
          >
            Classification
          </StepIndicator>
        </div>
        <div className="bg-white p-6 rounded-xl min-h-[250px] border border-line flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Attachments</span>{' '}
            <span className="text-body text-sm font-normal">(optional)</span>
          </div>

          <div
            className="border border-dashed rounded-3xl p-4 text-center grow flex items-center justify-center hover:bg-gray-50 duration-200 cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <span className="flex text-body">Click to browse or drag and drop your files</span>
          </div>
        </div>
      </div>
    </div>
  );
};
