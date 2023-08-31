'use client';
import React from 'react';
import { useGetJobById } from '@/lib/api/job';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { useJobEditStore, JobEditSteps } from '@/lib/store/job-edit';
import { Steps, JobDetails, DescriptionAndDeliverables, JobType, Review, Visibility } from '@/components/jobs/edit-job';

const STEPS: Record<JobEditSteps, React.FC> = {
  review: Review,
  project: JobType,
  details: JobDetails,
  visibility: Visibility,
  deliverables: DescriptionAndDeliverables,
};

interface Props {
  params: {
    'job-id': string;
  };
}

export default function EditJob({ params }: Props) {
  const jobId = params['job-id'];
  const jobData = useGetJobById({ jobId });
  const setJob = useJobEditStore((state) => state.setJob);
  const activeStep = useJobEditStore((state) => state.activeStep);

  if (jobData.isLoading) return <PageLoading className="absolute inset-0" />;

  if (jobData.isError) return <PageError className="absolute inset-0" />;

  const { data: job } = jobData;

  // setJob({
  //   id: jobId
  //   type: job.type,
  //   title: job.name,
  //   deliverables: [],
  //   skills: job.skills,
  //   price: job.paymentFee,
  //   category: job.category,
  //   dueDate: job.deliveryDate,
  //   description: job.description,
  //   visibility: job.isPrivate ? 'private' : 'public',
  // });

  const CurrentStep = STEPS[activeStep];

  return (
    <div className="flex gap-6">
      <div className="basis-[270px] shrink-0 grow-0 border border-line bg-white rounded-lg h-fit px-4 py-5">
        <Steps />
      </div>
      <div className="border w-full border-line bg-white rounded-lg p-6 h-fit">
        <CurrentStep />
      </div>
    </div>
  );
}
