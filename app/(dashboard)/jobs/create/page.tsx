'use client';
import React from 'react';
import { useJobCreationStore, JobCreationSteps } from '@/lib/store';
import {
  Steps,
  JobDetails,
  DescriptionAndDeliverables,
  Projects,
  Review,
  Visibility,
} from '@/components/jobs/create-job';

const STEPS: Record<JobCreationSteps, React.FC> = {
  review: Review,
  project: Projects,
  details: JobDetails,
  visibility: Visibility,
  deliverables: DescriptionAndDeliverables,
};

export default function CreateJob() {
  const activeStep = useJobCreationStore((state) => state.activeStep);

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
