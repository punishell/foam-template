import React from 'react';
import { MoreVertical } from 'lucide-react';
import { isJobDeliverable, type Job } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';
import { AfroProfile } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';
import { DeliverablesStepper } from '@/components/jobs/deliverables-stepper';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/common/popover';

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
      <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-3xl flex items-center justify-between">
        <div className="max-w-[90%]">{name}</div>
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
            <button className="px-4 py-2 hover:bg-red-100 duration-200 text-left">Report an Issue</button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex py-6 px-4 flex-col gap-6 h-full grow">
        <div className="flex flex-col gap-6">
          <div className="border bg-[#F8FFF4] border-[#7DDE86] p-4 rounded-2xl grid grid-cols-4 divide-x">
            <div className="pr-4 flex flex-col gap-2">
              <span className="text-body">Date Created</span>
              <span>{format(new Date(createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <div className="px-4 flex flex-col gap-2">
              <span className="text-body">Due Date</span>
              <span>{format(new Date(deliveryDate), 'MMM dd, yyyy')}</span>
            </div>

            <div className="px-4 flex flex-col gap-2">
              <span className="text-body">Price</span>
              <span>{paymentFee} USD</span>
            </div>
            <div className="pl-4 flex flex-col gap-2">
              <span className="text-body">Status</span>
              <span className="px-3 py-1 text-sm text-white inline-flex rounded-full bg-[#4CD471] w-fit">
                {progress === 100 ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>

          <div className="border bg-[#F8FFF4] border-[#7DDE86] p-4 rounded-2xl flex flex-col divide-y">
            <div className="pb-4 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <AfroProfile score={creator.score} size="sm">
                  <div className="h-full w-full rounded-full">
                    {creator.profileImage?.url ? (
                      <Image src={creator.profileImage?.url} fill alt="profile" className="rounded-full" />
                    ) : (
                      <DefaultAvatar />
                    )}
                  </div>
                </AfroProfile>
                <div className="flex flex-col">
                  <span className="text-title text-base font-bold">{`
                    ${creator.firstName} ${creator.lastName}
                    `}</span>
                  <span className="text-sm capitalize">{creator.profile.bio.title}</span>
                </div>
              </div>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <span className="text-body">Skills</span>
              <div className="flex items-center gap-2 text-sm">
                {tags.map(({ color, name }) => {
                  return (
                    <span
                      key={name}
                      className={`px-4 capitalize rounded-full py-0.5`}
                      style={{
                        backgroundColor: color,
                      }}
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

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
              jobId={jobId}
              jobCreator={creator._id}
              talentId={String(owner?._id)}
              readonly
              deliverables={deliverables.map(({ _id, name, progress, updatedAt }) => ({
                progress,
                updatedAt,
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
