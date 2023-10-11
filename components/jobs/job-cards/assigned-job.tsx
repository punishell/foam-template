'use client';
import React from 'react';
import { Button } from 'pakt-ui';
import { JobStatus } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { SideModal } from '@/components/common/side-modal';
import { AfroProfile } from '@/components/common/afro-profile';
import { ClientJobModal } from '@/components/jobs/job-modals/client';
import { TalentJobModal } from '@/components/jobs/job-modals/talent';
import { DeliverableProgressBar } from '@/components/common/deliverable-progress-bar';

interface ClientJobCardProps {
  jobId: string;
  title: string;
  price: number;
  status: JobStatus;
  totalDeliverables: number;
  progress: number; // 0 to 100
  talent: {
    id: string;
    name: string;
    avatar?: string;
    paktScore: number;
  };
}

export const ClientJobCard: React.FC<ClientJobCardProps> = ({
  talent,
  price,
  title,
  jobId,
  progress,
  status,
  totalDeliverables,
}) => {
  const router = useRouter();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);

  return (
    <div className="gap-4 bg-white rounded-3xl border-line w-full flex flex-col grow border p-4">
      <div className="w-full flex gap-4">
        <AfroProfile score={talent.paktScore} size="md" src={talent.avatar} />
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            {<span className="text-body text-lg font-bold">{talent.name}</span>}

            <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
          </div>
          <div className="grow text-title text-2xl">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="gap-2 flex items-center">
          {
            <Button size="xs" variant="secondary" onClick={() => setIsUpdateModalOpen(true)}>
              {status === 'completed' ? 'Review' : 'See Updates'}
            </Button>
          }
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              router.push(`/messages?userId=${talent.id}`);
            }}
          >
            Message Talent
          </Button>
        </div>

        {<DeliverableProgressBar percentageProgress={progress} totalDeliverables={totalDeliverables} />}

        <SideModal
          isOpen={isUpdateModalOpen}
          onOpenChange={() => setIsUpdateModalOpen(false)}
          className="flex flex-col"
        >
          <ClientJobModal jobId={jobId} talentId={talent.id} closeModal={() => setIsUpdateModalOpen(false)} />
        </SideModal>
      </div>
    </div>
  );
};

interface TalentJobCardProps {
  jobId: string;
  title: string;
  price: number;
  status: JobStatus;
  totalDeliverables: number;
  progress: number; // 0 to 100
  client: {
    id: string;
    name: string;
    avatar?: string;
    paktScore: number;
  };
}

export const TalentJobCard: React.FC<TalentJobCardProps> = ({
  client,
  price,
  title,
  progress,
  jobId,
  status,
  totalDeliverables,
}) => {
  const router = useRouter();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);

  return (
    <div className="gap-4 bg-white rounded-3xl border-line w-full flex flex-col grow border p-4">
      <div className="w-full flex gap-4">
        <AfroProfile score={client.paktScore} size="md" src={client.avatar} />
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            {<span className="text-body text-lg font-bold">{client.name}</span>}

            <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
          </div>
          <div className="grow text-title text-2xl">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="gap-2 flex items-center">
          <Button size="xs" variant="secondary" onClick={() => setIsUpdateModalOpen(true)}>
            {status === 'completed' ? 'Review' : 'Update'}
          </Button>

          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              router.push(`/messages?userId=${client.id}`);
            }}
          >
            Message Client
          </Button>
        </div>

        {<DeliverableProgressBar percentageProgress={progress} totalDeliverables={totalDeliverables} />}

        <SideModal
          isOpen={isUpdateModalOpen}
          onOpenChange={() => setIsUpdateModalOpen(false)}
          className="flex flex-col"
        >
          <TalentJobModal talentId={client.id} jobId={jobId} closeModal={() => setIsUpdateModalOpen(false)} />
        </SideModal>
      </div>
    </div>
  );
};
