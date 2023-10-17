import React from 'react';
import { MoreVertical } from 'lucide-react';
import { isJobDeliverable, type Job } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';
import { AfroScore } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';
import { DeliverablesStepper } from '@/components/jobs/deliverables-stepper';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/common/popover';
import { JobUpdateHeader } from '../job-update-header';

interface JobUpdatesProps {
  job: Job;
  requestJobCancellation: () => void;
}

export const JobUpdates: React.FC<JobUpdatesProps> = ({ job, requestJobCancellation }) => {
  const {
    name,
    tags,
    creator,
    owner,
    description,
    createdAt,
    deliveryDate,
    paymentFee,
    collections,
    progress,
    _id: jobId,
  } = job;
  const deliverables = collections.filter(isJobDeliverable);

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-3xl flex items-start justify-between">
        <div className="max-w-[90%] break-words">{name}</div>
        <Popover>
          <PopoverTrigger asChild>
            <button>
              <MoreVertical />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-red-100 bg-[#FFFFFF] flex flex-col mr-12 text-red-500 -mt-6 overflow-hidden">
            <button className="px-4 py-2 hover:bg-red-100 duration-200 text-left" onClick={requestJobCancellation}>
              Cancel Job
            </button>
            {/* <button className="px-4 py-2 hover:bg-red-100 duration-200 text-left">Report an Issue</button> */}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex py-6 px-4 flex-col gap-6 h-full grow">
        <JobUpdateHeader
          createdAt={createdAt}
          profile={owner ?? creator}
          deliveryDate={deliveryDate}
          paymentFee={paymentFee}
          tags={tags}
        />

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Job Description</h3>
          <p className="bg-[#C9F0FF] p-3 rounded-xl border border-blue-300">{description}</p>
        </div>
        <div className="flex flex-col gap-2 grow">
          <div>
            <h3 className="font-bold text-lg">Job Deliverables</h3>
            <p className="text-body">Mark the deliverables as you&rsquo;re done with them</p>
          </div>

          <div className="grow h-full">
            <DeliverablesStepper
              jobProgress={progress}
              jobId={jobId}
              jobCreator={creator._id}
              talentId={String(owner?._id)}
              readonly
              deliverables={deliverables.map(({ _id, name, progress, updatedAt, meta }) => ({
                progress,
                updatedAt,
                meta,
                jobId: jobId,
                description: name,
                deliverableId: _id,
                jobCreator: creator._id,
              }))}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
