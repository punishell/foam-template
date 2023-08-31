'use client';
import React from 'react';
import { Button } from 'pakt-ui';
import { useGetJobById } from '@/lib/api/job';
import { Modal } from '@/components/common/modal';
import { JobHeader, JobDescription, JobSkills, JobDeliverables } from '@/components/jobs/job-details';

interface Props {
  params: {
    'job-id': string;
  };
}

export default function JobDetails({ params }: Props) {
  const jobId = params['job-id'];
  const job = useGetJobById({ jobId });

  const VIEW_TYPE: 'client' | 'talent' = 'talent';

  const VIEWS = {
    client: ClientJobDetails,
    talent: TalentJobDetails,
  };

  const CurrentView = VIEWS[VIEW_TYPE];

  return (
    <div className="h-full">
      <CurrentView jobId={jobId} />
    </div>
  );
}

interface TalentJobDetailsProps {
  jobId: string;
}

const TalentJobDetails: React.FC<TalentJobDetailsProps> = ({ jobId }) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);

  const JOB_TYPE: 'private' | 'open' = 'private';

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

          <JobCtas />

          <Modal isOpen={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
            <TalentApplicationFormModal />
          </Modal>
        </div>
      </div>

      <div className="basis-[300px] h-full gap-7 w-fit flex flex-col items-center">
        <JobDescription />
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

const TalentPrivateJobCtas = () => {
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

const TalentOpenJobCtas = () => {
  return (
    <div className="max-w-[200px] w-full">
      <Button
        fullWidth
        // onClick={() => setIsApplyModalOpen(true)}
      >
        Apply
      </Button>
    </div>
  );
};

interface ClientJobDetailsProps {
  jobId: string;
}

const ClientJobDetails: React.FC<ClientJobDetailsProps> = ({ jobId }) => {
  const JOB_TYPE: 'private' | 'open' = 'private';

  const CTAS = {
    open: ClientOpenJobCtas,
    private: ClientPrivateJobCtas,
  };

  const JobCtas = CTAS[JOB_TYPE];

  return (
    <div className="flex gap-6 h-full">
      <div className="grow overflow-y-auto h-full flex flex-col pb-20">
        <JobHeader title="Email Newsletter Design for a Monthly Newsletter" price={6000} dueDate="2023" />
        <div className="bg-white flex flex-col w-full p-6 rounded-b-xl grow border-line border-t-0 border">
          <JobDeliverables
            deliverables={[
              'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
              'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
              'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
              'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
            ]}
          />

          <JobCtas />
        </div>
      </div>

      <div className="basis-[300px] h-full gap-7 w-fit flex flex-col items-center">
        <JobDescription />
        <JobSkills skills={['Adobe Photoshop', 'Adobe Illustrator', 'Figma']} />
      </div>
    </div>
  );
};

const ClientPrivateJobCtas = () => {
  return (
    <div className="mt-auto w-full flex items-center justify-between gap-4">
      <div className="w-full max-w-[150px]">
        <Button fullWidth variant="danger">
          Cancel Job
        </Button>
      </div>

      <div className="w-full flex gap-2 items-center max-w-sm">
        <Button fullWidth variant="outline">
          Edit Job
        </Button>
        <Button fullWidth>Find Talent</Button>
      </div>
    </div>
  );
};

const ClientOpenJobCtas = () => {
  return (
    <div className="mt-auto w-full flex items-center justify-between gap-4">
      <div className="w-full max-w-[150px]">
        <Button fullWidth variant="danger">
          Cancel Job
        </Button>
      </div>

      <div className="w-full flex gap-2 items-center max-w-sm">
        <Button fullWidth variant="outline">
          Edit Job
        </Button>
        <Button fullWidth>View Applicants</Button>
      </div>
    </div>
  );
};
