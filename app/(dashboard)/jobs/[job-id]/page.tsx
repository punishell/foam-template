'use client';
import React from 'react';
import { Button } from 'pakt-ui';
import type { Job } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useGetJobById } from '@/lib/api/job';
import { useGetAccount } from '@/lib/api/account';
import { Modal } from '@/components/common/modal';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';
import { JobHeader, JobDescription, JobSkills, JobDeliverables } from '@/components/jobs/job-details';

interface Props {
  params: {
    'job-id': string;
  };
}

export default function JobDetails({ params }: Props) {
  const jobId = params['job-id'];
  const accountData = useGetAccount();
  const jobData = useGetJobById({ jobId });

  if (jobData.isError) return <PageError className="absolute inset-0" />;
  if (jobData.isLoading) return <PageLoading className="absolute inset-0" />;

  const { data: job } = jobData;
  const { data: account } = accountData;
  const USER_ROLE: 'client' | 'talent' = account?._id === job.creator._id ? 'client' : 'talent';

  const VIEWS = {
    client: ClientJobDetails,
    talent: TalentJobDetails,
  };

  const CurrentView = VIEWS[USER_ROLE];

  return (
    <div className="h-full">
      <CurrentView job={job} />
    </div>
  );
}

// CLIENT JOB DETAILS

interface ClientJobDetailsProps {
  job: Job;
}

const ClientJobDetails: React.FC<ClientJobDetailsProps> = ({ job }) => {
  const JOB_TYPE: 'private' | 'open' = job.isPrivate ? 'private' : 'open';

  const CTAS = {
    open: ClientOpenJobCtas,
    private: ClientPrivateJobCtas,
  };

  const JobCtas = CTAS[JOB_TYPE];

  return (
    <div className="flex gap-6 h-full">
      <div className="grow overflow-y-auto h-full flex flex-col pb-20">
        <JobHeader title={job.name} price={job.paymentFee} dueDate={job.deliveryDate} />
        <div className="bg-white flex flex-col w-full p-6 rounded-b-xl grow border-line border-t-0 border">
          <JobDeliverables
            deliverables={job.collections
              .filter((collection) => collection.type === 'deliverable')
              .map((collection) => collection.name)}
          />

          <JobCtas jobId={job._id} />
        </div>
      </div>

      <div className="basis-[300px] h-full gap-7 w-fit flex flex-col items-center">
        <JobDescription description={job.description} />
        <JobSkills skills={[...job.tagsData]} />
      </div>
    </div>
  );
};

interface ClientPrivateJobCtasProps {
  jobId: string;
}

const ClientPrivateJobCtas: React.FC<ClientPrivateJobCtasProps> = ({ jobId }) => {
  const router = useRouter();

  return (
    <div className="mt-auto w-full flex items-center justify-between gap-4">
      <div className="w-full max-w-[150px]">
        <Button fullWidth variant="danger">
          Delete Job
        </Button>
      </div>

      <div className="w-full flex gap-2 items-center max-w-sm">
        <Button
          fullWidth
          variant="outline"
          onClick={() => {
            router.push(`/jobs/${jobId}/edit`);
          }}
        >
          Edit Job
        </Button>
        <Button
          fullWidth
          onClick={() => {
            router.push(`/talents`);
          }}
        >
          Find Talent
        </Button>
      </div>
    </div>
  );
};

interface ClientOpenJobCtasProps {
  jobId: string;
}

const ClientOpenJobCtas: React.FC<ClientOpenJobCtasProps> = ({ jobId }) => {
  const router = useRouter();

  return (
    <div className="mt-auto w-full flex items-center justify-between gap-4">
      <div className="w-full max-w-[150px]">
        <Button fullWidth variant="danger">
          Delete Job
        </Button>
      </div>

      <div className="w-full flex gap-2 items-center max-w-sm">
        <Button
          fullWidth
          variant="outline"
          onClick={() => {
            router.push(`/jobs/${jobId}/edit`);
          }}
        >
          Edit Job
        </Button>
        <Button
          fullWidth
          onClick={() => {
            router.push(`/jobs/${jobId}/applicants`);
          }}
        >
          View Applicants
        </Button>
      </div>
    </div>
  );
};

interface TalentJobDetailsProps {
  job: Job;
}

// TALENT JOB DETAILS

const TalentJobDetails: React.FC<TalentJobDetailsProps> = ({ job }) => {
  const JOB_TYPE: 'private' | 'open' = job.isPrivate ? 'private' : 'open';

  const CTAS = {
    open: TalentOpenJobCtas,
    private: TalentPrivateJobCtas,
  };

  const JobCtas = CTAS[JOB_TYPE];

  return (
    <div className="flex gap-6 h-full">
      <div className="grow overflow-y-auto h-full flex flex-col pb-20">
        <JobHeader
          title="Email Newsletter Design for a Monthly Newsletter"
          price={6000}
          dueDate="2023"
          creator={{
            score: 85,
            avatar: '',
            name: 'John Doe',
          }}
        />
        <div className="bg-white flex flex-col w-full p-6 rounded-b-xl grow border-line border-t-0 border">
          <JobDeliverables
            deliverables={[
              'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
              'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
              'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
              'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
            ]}
          />

          <JobCtas jobId={job._id} />
        </div>
      </div>

      <div className="basis-[300px] h-full gap-7 w-fit flex flex-col items-center">
        <JobDescription
          description=" Are you a naturally goofy person who loves making people laugh? Do you have a wild imagination and a passion for
        creating hilarious product designs? If so, we have the perfect short-term contract position for you as our Chief
        Goofiness Officer!"
        />
        <JobSkills skills={['Adobe Photoshop', 'Adobe Illustrator', 'Figma']} />
      </div>
    </div>
  );
};

const TalentApplicationFormModal = () => {
  return (
    <div className="border w-full max-w-xl flex flex-col gap-4 bg-white p-6 rounded-2xl">
      <div className="flex flex-col gap-1 items-center">
        <h2 className="font-medium text-2xl">Propose Price</h2>
        <span className="text-body">What do you think is a fair price for this job</span>
      </div>

      <form className="flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="due" className="text-title">
            Enter Bid
          </label>
          <input
            type="text"
            id="due"
            placeholder="Frontend Developer"
            className="w-full border bg-[#FCFCFD] border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="due" className="text-title">
            Message (Optional)
          </label>
          <textarea
            rows={3}
            maxLength={400}
            placeholder="Enter your message here"
            className="w-full resize-none bg-[#FCFCFD] border border-line rounded-lg outline-none px-4 py-3 focus-within:border-secondary hover:border-secondary hover:duration-200"
          />
        </div>

        <Button fullWidth>Send Application</Button>
      </form>
    </div>
  );
};

const TalentApplicationSuccessModal = () => {
  return (
    <div className="border w-full max-w-xl flex flex-col gap-4 bg-white p-6 rounded-2xl">
      <div className="flex flex-col gap-1 items-center">
        <h2 className="font-medium text-2xl">Application Sent</h2>
        <span className="text-body">You will get a notification if the client sends you a message</span>
      </div>
    </div>
  );
};

interface TalentPrivateJobCtasProps {
  jobId: string;
}

const TalentPrivateJobCtas: React.FC<TalentPrivateJobCtasProps> = ({ jobId }) => {
  return (
    <div className="mt-auto w-full flex items-center justify-end">
      <div className="w-full flex items-center max-w-sm gap-4">
        <Button fullWidth variant="danger">
          Decline
        </Button>
        <Button fullWidth>Accept</Button>
      </div>
    </div>
  );
};

interface TalentOpenJobCtasProps {
  jobId: string;
}

const TalentOpenJobCtas: React.FC<TalentOpenJobCtasProps> = ({ jobId }) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);

  return (
    <div className="max-w-[200px] w-full">
      <Button fullWidth onClick={() => setIsApplyModalOpen(true)}>
        Apply
      </Button>

      <Modal isOpen={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <TalentApplicationFormModal />
      </Modal>
    </div>
  );
};
