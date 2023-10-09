import React, { useMemo } from 'react';

import { Spinner } from '../common';
import { useGetTimeline } from '@/lib/api/dashboard';
import { FEED_TYPES } from '@/lib/utils';
import { ParseFeedView } from './utils';
import { useUserState } from '@/lib/store/account';
import { PageEmpty } from '../common/page-empty';
import { PageLoading } from '../common/page-loading';
import { PageError } from '../common/page-error';
import { useGetJobs } from '@/lib/api/job';
import Link from 'next/link';
import { Button } from 'pakt-ui';
import { DeliverableProgressBar } from '../common/deliverable-progress-bar';
import { Briefcase } from 'lucide-react';
import { SideModal } from '../common/side-modal';
import { TalentJobModal } from '../jobs/job-modals/talent';
import { ClientJobModal } from '../jobs/job-modals/client';
import { AfroProfile } from '../common/afro-profile';
interface ActiveJobCardProps {
  id: string;
  title: string;
  description: string;
  talent: {
    _id: string;
    name: string;
    avatar: string;
    score: number;
  };
  bookmarked: boolean;
  bookmarkId: string;
  jobId: string;
  creator: {
    _id: string;
    name: string;
    avatar: string;
    score: number;
  };
  isCreator: boolean;
  progress: {
    total: number;
    progress: number;
  };
}

const ActiveJobCard: React.FC<ActiveJobCardProps> = ({
  id,
  talent,
  creator,
  title,
  description,
  progress,
  isCreator,
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 pl-2 px-4  flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile src={talent.avatar} score={talent.score} size="md" />
      <div className="flex flex-col gap-4 py-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">{title}</h3>
        </div>
        <p className="text-body">{description}</p>
        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary" onClick={() => setIsUpdateModalOpen(true)}>
              {isCreator ? 'View Updates' : 'Update'}
            </Button>
            <Link href={`/messages?userId=${isCreator ? talent._id : creator._id}`}>
              <Button size="xs" variant="outline">
                Message
              </Button>
            </Link>
            <DeliverableProgressBar percentageProgress={progress.progress} totalDeliverables={progress.total} />
          </div>
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
      <SideModal isOpen={isUpdateModalOpen} onOpenChange={() => setIsUpdateModalOpen(false)} className="flex flex-col">
        {!isCreator ? (
          <TalentJobModal jobId={id} closeModal={() => setIsUpdateModalOpen(false)} />
        ) : (
          <ClientJobModal jobId={id} closeModal={() => setIsUpdateModalOpen(false)} />
        )}
      </SideModal>
    </div>
  );
};

export const ActiveJobs = () => {
  const { _id: loggedInUser } = useUserState();
  const {
    data: jobAssignedData,
    isFetched: assignedFetched,
    isFetching: assignedFetching,
    isError: assignedError,
  } = useGetJobs({ category: 'assigned', status: 'ongoing' });
  const {
    data: jobCreatedData,
    isFetched,
    isFetching,
    isError,
  } = useGetJobs({ category: 'created', status: 'ongoing' });
  const jobDataJoined = [...(jobAssignedData?.data || []), ...(jobCreatedData?.data || [])];
  const jobData = jobDataJoined.filter((f) => f.inviteAccepted);

  const activeJobs = useMemo(
    () =>
      (jobData || []).map((job, i) => {
        const deliverableTotal = job?.collections.filter((f) => f.type == 'deliverable').length;
        const deliverableTotalCompleted = job?.collections.filter((f) => f.type == 'deliverable' && f.progress == 100)
          .length;
        const currentProgress = parseInt(String((deliverableTotalCompleted * 100) / deliverableTotal));
        const deliverableCountPercentage = {
          total: deliverableTotal,
          progress: currentProgress,
        };
        return (
          <ActiveJobCard
            key={i}
            id={job._id}
            bookmarkId=""
            bookmarked={false}
            progress={deliverableCountPercentage}
            creator={{
              _id: job.creator._id,
              name: `${job?.creator?.firstName} ${job?.creator?.lastName}`,
              avatar: job?.creator?.profileImage?.url || '',
              score: job?.creator.score,
            }}
            talent={{
              _id: job?.owner ? job?.owner._id : '',
              name: `${job?.owner?.firstName} ${job?.owner?.lastName}`,
              avatar: job?.owner?.profileImage?.url || '',
              score: job?.owner ? job?.owner.score : 0,
            }}
            description={job.description}
            title={job.name}
            isCreator={job.creator._id == loggedInUser}
            jobId={job._id}
          />
        );
      }),
    [jobData],
  );
  if ((!isFetched || !assignedFetched) && (isFetching || assignedFetching))
    return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;
  if (isError || assignedError) return <PageError className="rounded-2xl border border-red-200 h-[85vh]" />;
  if (activeJobs.length === 0) return <PageEmpty className="h-[85vh] rounded-2xl border border-line" />;

  return (
    <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">{activeJobs}</div>
  );
};
