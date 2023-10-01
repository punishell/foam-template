'use client';
import React from 'react';
import { Button } from 'pakt-ui';
import { format } from 'date-fns';
import { Spinner } from '@/components/common';
import { useApplyToOpenJob } from '@/lib/api/job';
import { useDeclineInvite, useAcceptInvite } from '@/lib/api/invites';
import type { Job } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useDeleteJob, useGetJobById } from '@/lib/api/job';
import { useSearchParams } from 'next/navigation';
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
  console.log('job', job);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const JOB_TYPE: 'private' | 'open' = job.isPrivate ? 'private' : 'open';

  const CTAS = {
    open: ClientOpenJobCtas,
    private: ClientPrivateJobCtas,
  };

  const JobCtas = CTAS[JOB_TYPE];

  return (
    <div className="flex gap-6 h-full">
      <div className="grow overflow-y-auto h-full flex flex-col pb-20">
        <JobHeader
          title={job.name}
          price={job.paymentFee}
          dueDate={job.deliveryDate}
          creator={{
            score: job.creator.score,
            avatar: job.creator.profileImage?.url,
            name: `${job.creator.firstName} ${job.creator.lastName}`,
          }}
        />
        <div className="bg-white flex flex-col w-full p-6 rounded-b-xl grow border-line border-t-0 border">
          <JobDeliverables
            deliverables={job.collections
              .filter((collection) => collection.type === 'deliverable')
              .map((collection) => collection.name)}
          />

          {job.invites.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg my-3 text-body w-full">
              Awaiting Talent Response
            </div>
          )}

          {job.invites.length === 0 && (
            <JobCtas jobId={job._id} skills={job.tagsData} openDeleteModal={() => setIsDeleteModalOpen(true)} />
          )}
        </div>
      </div>

      <div className="basis-[300px] h-full gap-7 w-fit flex flex-col items-center">
        <JobDescription description={job.description} />
        <JobSkills skills={[...job.tagsData]} />
      </div>

      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DeleteJobModal jobId={job._id} title={job.name} setModalOpen={setIsDeleteModalOpen} />
      </Modal>
    </div>
  );
};

interface ClientPrivateJobCtasProps {
  jobId: string;
  openDeleteModal: () => void;
  skills?: string[];
}

const ClientPrivateJobCtas: React.FC<ClientPrivateJobCtasProps> = ({ jobId, skills, openDeleteModal }) => {
  const router = useRouter();

  return (
    <div className="mt-auto w-full flex items-center justify-between gap-4">
      <div className="w-full max-w-[150px]">
        <Button fullWidth variant="danger" onClick={openDeleteModal}>
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
            router.push(`/talents${skills && skills?.length > 0 ? `?skills=${skills?.join(',')}` : ''}`);
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
  openDeleteModal: () => void;
}

const ClientOpenJobCtas: React.FC<ClientOpenJobCtasProps> = ({ jobId, openDeleteModal }) => {
  const router = useRouter();

  return (
    <div className="mt-auto w-full flex items-center justify-between gap-4">
      <div className="w-full max-w-[150px]">
        <Button fullWidth variant="danger" onClick={openDeleteModal}>
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

interface ClientDeleteJobModalProps {
  jobId: string;
  title: string;
  setModalOpen: (state: boolean) => void;
}

const DeleteJobModal: React.FC<ClientDeleteJobModalProps> = ({ jobId, title, setModalOpen }) => {
  const deleteMutate = useDeleteJob();
  const router = useRouter();

  const deleteCall = async () => {
    await deleteMutate.mutateAsync({ id: jobId });
    router.push('/jobs');
    setModalOpen(false);
  };

  return (
    <div className="border w-full max-w-xl flex flex-col gap-4 bg-white p-6 rounded-2xl">
      <div className="flex flex-col gap-1 items-center">
        <h2 className="font-medium text-2xl">Confirm Job Deletion</h2>
        <span className="text-body text-center">You are about to permanently delete job</span>
        <span className="text-body font-bold">{title}</span>
      </div>
      <div className="mt-auto w-full flex flex-row items-center justify-between gap-2">
        <Button fullWidth variant="primary" onClick={deleteCall} disabled={deleteMutate.isLoading}>
          {deleteMutate.isLoading ? <Spinner /> : 'Confirm'}
        </Button>
        <Button fullWidth variant="outline" onClick={() => setModalOpen(false)}>
          Cancel
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
  const searchParams = useSearchParams();
  const inviteId = searchParams.get('invite-id');
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
          title={job.name}
          price={job.paymentFee}
          dueDate="2023"
          creator={{
            score: job.creator.score,
            avatar: job.creator.profileImage?.url,
            name: `${job.creator.firstName} ${job.creator.lastName}`,
          }}
        />
        <div className="bg-white flex flex-col w-full p-6 rounded-b-xl grow border-line border-t-0 border">
          <JobDeliverables
            deliverables={job.collections
              .filter((collection) => collection.type === 'deliverable')
              .map((collection) => collection.name)}
          />

          <JobCtas jobId={job._id} inviteId={inviteId} />
        </div>
      </div>

      <div className="basis-[300px] h-full gap-7 w-fit flex flex-col items-center">
        <JobDescription description={job.description} />
        <JobSkills skills={[...job.tagsData]} />
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
            placeholder="Enter Bid (e.g $100)"
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
  inviteId: string | null;
}

const TalentPrivateJobCtas: React.FC<TalentPrivateJobCtasProps> = ({ inviteId }) => {
  const router = useRouter();
  const acceptInvite = useAcceptInvite();
  const declineInvite = useDeclineInvite();

  if (!inviteId) return null;

  return (
    <div className="mt-auto w-full flex items-center justify-end">
      <div className="w-full flex items-center max-w-sm gap-4">
        <Button
          fullWidth
          size="sm"
          variant="secondary"
          onClick={() => {
            declineInvite.mutate(
              { id: inviteId },
              {
                onSuccess: () => {
                  router.push('/jobs');
                },
              },
            );
          }}
        >
          {declineInvite.isLoading ? <Spinner /> : 'Decline'}
        </Button>

        <Button
          fullWidth
          size="sm"
          onClick={() => {
            acceptInvite.mutate(
              { id: inviteId },
              {
                onSuccess: () => {
                  router.push('/jobs?jobs-type=accepted');
                },
              },
            );
          }}
        >
          {acceptInvite.isLoading ? <Spinner /> : 'Accept Invite'}
        </Button>
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
    <div className="max-w-[200px] w-full ml-auto">
      <Button fullWidth onClick={() => setIsApplyModalOpen(true)}>
        Apply
      </Button>

      <Modal isOpen={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <TalentApplicationFormModal />
      </Modal>
    </div>
  );
};
