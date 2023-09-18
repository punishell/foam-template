'use client';
import React from 'react';
import { format } from 'date-fns';
import type { Job } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Calendar, Tag } from 'lucide-react';
import { useGetJobById } from '@/lib/api/job';
import { useGetAccount } from '@/lib/api/account';
import { Button, Select, Checkbox } from 'pakt-ui';
import { PageError } from '@/components/common/page-error';
import { Pagination } from '@/components/common/pagination';
import { PageLoading } from '@/components/common/page-loading';
import { AfroProfile } from '@/components/common/afro-profile';

interface Props {
  params: {
    'job-id': string;
  };
}

export default function JobApplications({ params }: Props) {
  const jobId = params['job-id'];
  const accountData = useGetAccount();
  const jobData = useGetJobById({ jobId });

  if (jobData.isError) return <PageError className="absolute inset-0" />;
  if (jobData.isLoading) return <PageLoading className="absolute inset-0" />;

  const { data: job } = jobData;
  const { data: account } = accountData;

  const isClient = account?._id === job.creator._id;

  if (!isClient) return <PageError className="absolute inset-0" />;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-primary-gradient rounded-xl justify-between flex p-4 py-6 gap-4">
        <div className="grow max-w-3xl flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-white max-w-[560px]">{job.name}</h2>
          <p className="text-white max-w-xl">{job.description}</p>
          <div className="flex gap-4 items-center mt-auto">
            <span className="bg-[#C9F0FF] text-[#0065D0] gap-2 flex items-center px-3 rounded-full py-1">
              <Tag size={20} />
              <span>$ {job.paymentFee}</span>
            </span>

            <span className="bg-[#ECFCE5] text-[#198155] gap-2 flex items-center px-3 rounded-full py-1">
              <Calendar size={20} />
              <span>Due {format(new Date(job.deliveryDate), 'MMM dd, yyyy')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-6 grow">
        <ApplicantsFilter />
        <ApplicantList />
      </div>
    </div>
  );
}

interface ApplicantsFilterProps {}

const ApplicantsFilter: React.FC<ApplicantsFilterProps> = () => {
  return (
    <div className="shrink-0 basis-[300px] grow-0 bg-white rounded-2xl border p-4 border-[#7DDE86] h-fit flex flex-col gap-4">
      <div>
        <label htmlFor="score">Afroscore</label>
        <Select
          placeholder="Highest to lowest"
          options={[
            {
              label: 'Highest to lowest',
              value: 'highest-to-lowest',
            },
            {
              label: 'Lowest to highest',
              value: 'lowest-to-highest',
            },
          ]}
          onChange={() => {}}
        />
      </div>
      <div>
        <label htmlFor="bid">Bid</label>
        <Select
          placeholder="Highest to lowest"
          options={[
            {
              label: 'Highest to lowest',
              value: 'highest-to-lowest',
            },
            {
              label: 'Lowest to highest',
              value: 'lowest-to-highest',
            },
          ]}
          onChange={() => {}}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span>Preferred Skills</span>

        <div className="flex flex-col gap-2">
          <button className="border bg-gray-50 py-3 rounded-lg gap-2 flex items-center px-3 w-full justify-between hover:border-[#7DDE86] duration-300">
            <span className="text-body">UI / UX</span>
            <Checkbox checked />
          </button>

          <button className="border bg-gray-50 py-3 rounded-lg gap-2 flex items-center px-3 w-full justify-between hover:border-[#7DDE86] duration-300">
            <span className="text-body">FigmaX</span>
            <Checkbox checked />
          </button>

          <button className="border bg-gray-50 py-3 rounded-lg gap-2 flex items-center px-3 w-full justify-between hover:border-[#7DDE86] duration-300">
            <span className="text-body">Typescript</span>
            <Checkbox checked />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ApplicantListProps {}

const ApplicantList: React.FC<ApplicantListProps> = () => {
  return (
    <div className="grow h-full flex flex-col gap-4">
      <div className="overflow-y-auto flex flex-col gap-4 ">
        <ApplicantCard />
        <ApplicantCard />
        <ApplicantCard />
      </div>
      <div className="">
        <Pagination currentPage={1} totalPages={1} setCurrentPage={() => {}} />
      </div>
    </div>
  );
};

const skills = ['UI / UX', 'FigmaX', 'Typescript'];

interface ApplicantCardProps {}
const ApplicantCard: React.FC<ApplicantCardProps> = () => {
  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-line flex flex-col gap-3">
      <div className="w-full flex gap-4">
        {<AfroProfile score={50} size="sm" />}
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            {<span className="text-title text-lg font-bold">{'Ibrahim Suleiman'}</span>}

            <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">Bid ${500}</span>
          </div>
          <div className="grow text-body text-lg">
            {
              'I am an experienced designer with creative flair. Proven track record of delivering impactful visuals. Ready to elevate your project.'
            }
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-green-100 grow whitespace-nowrap text-[#090A0A] rounded-full px-4 py-0.5">
              {skill}
            </span>
          ))}
        </div>
        <div className="gap-2 flex items-center">
          <Button size="xs" variant="secondary">
            Message
          </Button>
          <Button size="xs" variant="outline">
            Accept Bid
          </Button>
        </div>
      </div>
    </div>
  );
};
