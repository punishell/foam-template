import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useGetJobById } from '@/lib/api/job';
import { AfroProfile } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';
import { DeliverablesStepper } from '@/components/jobs/deliverables-stepper';

import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';

interface TalentJobModalProps {
  jobId: string;
}

export const TalentJobModal: React.FC<TalentJobModalProps> = ({ jobId }) => {
  const query = useGetJobById({ jobId });

  if (query.isError) return <PageError className="absolute inset-0" />;

  if (query.isLoading) return <PageLoading className="absolute inset-0" />;

  const job = query.data;

  const { name, creator, tags, description, createdAt, deliveryDate, paymentFee, collections, progress } = job;

  const deliverables = collections.filter((collection) => collection.type === 'deliverable');

  return (
    <React.Fragment>
      <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-3xl">{name}</div>
      <div className="flex py-6 px-4 flex-col gap-6 h-full grow">
        <div className="flex flex-col gap-4">
          <table className="table-auto">
            <colgroup>
              <col style={{ width: '25%' }} />
              <col style={{ width: '75%' }} />
            </colgroup>
            <tbody>
              <tr>
                <th className="py-2 text-left font-normal text-body">Date Created</th>
                <td className=" px-4 py-2">{format(new Date(createdAt), 'MMM dd, yyyy')}</td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Due Date</th>
                <td className=" px-4 py-2">{format(new Date(deliveryDate), 'MMM dd, yyyy')}</td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Price</th>
                <td className=" px-4 py-2">{paymentFee} USD</td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Status</th>
                <td className=" px-4 py-2">
                  <span className="px-3 text-sm text-title inline-flex rounded-full bg-[#B2E9AA66]">
                    {progress === 100 ? 'Completed' : 'In Progress'}
                  </span>
                </td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Client</th>
                <td className=" px-4 py-2">
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
                      <span className="text-sm ">{creator.profile.bio.title}</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="py-2 text-left font-normal text-body">Skills</th>
                <td className=" px-4 py-2">
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Job Description</h3>
          <p className="bg-[#C9F0FF] p-3 rounded-xl border border-blue-200">{description}</p>
        </div>
        <div className="flex flex-col gap-2 grow">
          <div>
            <h3 className="font-bold text-lg">Job Deliverables</h3>
            <p className="text-body">Mark the deliverables as you&rsquo;re done with them</p>
          </div>

          <div className="grow h-full">
            <DeliverablesStepper
              jobId={jobId}
              deliverables={deliverables.map(({ _id, name, progress, updatedAt }) => ({
                jobId,
                progress,
                updatedAt,
                description: name,
                deliverableId: _id,
              }))}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
