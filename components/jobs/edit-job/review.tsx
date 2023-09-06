'use client';
import React from 'react';
import { Button } from 'pakt-ui';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useUpdateJob } from '@/lib/api/job';
import { Spinner } from '@/components/common';
import { useJobEditStore } from '@/lib/store/job-edit';
import { Tag, Calendar, PenLine } from 'lucide-react';

export const Review: React.FC = () => {
  const router = useRouter();
  const updateJob = useUpdateJob();
  const job = useJobEditStore((state) => state.job);
  const resetJob = useJobEditStore((state) => state.resetJobEdit);
  const gotoStep = useJobEditStore((state) => state.gotoStep);

  const handleJobUpdate = () => {
    updateJob.mutate(
      {
        id: job.id,
        name: job.title,
        tags: job.skills,
        category: job.category,
        description: job.description,
        paymentFee: Number(job.budget),
        deliverables: job.deliverables,
        isPrivate: job.visibility === 'private',
        deliveryDate: format(job.due || 0, 'yyyy-MM-dd'),
      },
      {
        onSuccess(_data, { id }) {
          resetJob();
          router.push(`/jobs/${id}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col">
      <div className="bg-primary-gradient rounded-t-xl justify-between flex p-4 gap-4">
        <div className="grow max-w-3xl flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-white">{job.title || 'Job title goes here'}</h2>
          <div className="flex gap-4 items-center mt-auto justify-between w-full">
            <div className="flex gap-4 items-center">
              <span className="bg-[#C9F0FF] text-[#0065D0] gap-2 flex items-center px-4 rounded-full py-1">
                <Tag size={20} />
                <span>$ {job.budget}</span>
              </span>

              <span className="bg-[#ECFCE5] text-[#198155] gap-2 flex items-center px-4 rounded-full py-1">
                <Calendar size={20} />
                <span>{format(job.due || 0, 'MMM dd, yyyy')}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="self-end">
          <button className="flex gap-2 items-center text-white" onClick={() => gotoStep('details')}>
            <PenLine size={20} />
            <span>Edit</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col border border-line border-t-0 p-6 rounded-b-xl gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h4 className="font-medium">Preferred Skills</h4>

            <EditButton onClick={() => gotoStep('details')} />
          </div>

          <div className="flex gap-1 items-center">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#ECFCE5] text-[#198155] gap-2 flex items-center px-4 text-sm rounded-full py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-col w-full">
          <div className="flex items-center gap-4">
            <h4 className="font-medium">Job Description</h4>
            <EditButton onClick={() => gotoStep('deliverables')} />
          </div>
          <p className="text-base font-normal text-[#202325] rounded-lg py-2 px-3 bg-[#FEF4E3]">
            {job.description || 'Job description goes here'}
          </p>
        </div>

        <div className="flex gap-2 flex-col w-full">
          <div className="flex items-center gap-4">
            <h4 className="font-medium">Deliverables</h4>
            <EditButton onClick={() => gotoStep('deliverables')} />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto h-full">
            {job.deliverables.map((deliverable, index) => (
              <div key={index} className="rounded-md bg-[#F7F9FA] p-4 py-2 text-[#090A0A]">
                {deliverable}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <div className="max-w-[200px] w-full">
          <Button variant="primary" size="sm" fullWidth onClick={handleJobUpdate}>
            {updateJob.isLoading ? <Spinner /> : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <button className="flex gap-2 items-center text-title text-sm" onClick={onClick}>
      <PenLine size={20} />
      <span>Edit</span>
    </button>
  );
};
