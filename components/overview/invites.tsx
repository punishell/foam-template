import React from 'react';
import { JobFeedCard } from './feedViewer';
import { useGetInvites } from '@/lib/api/invites';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';

export const Invites = () => {
  const query = useGetInvites({ filter: { status: 'pending' } });

  if (query.isLoading) return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;

  if (query.isError) return <PageError className="rounded-2xl border border-red-200 h-[85vh]" />;

  const invites = query.data.data;

  if (invites.length === 0) return <PageEmpty className="h-[85vh] rounded-2xl border border-line" />;

  return (
    <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">
      {invites.map(({ _id: inviteId, data }) => {
        const { creator, name, _id: jobId, paymentFee } = data;
        return (
          <JobFeedCard
            id={jobId}
            title={name}
            jobId={jobId}
            key={inviteId}
            type="job-invite-pending"
            inviteId={inviteId}
            amount={paymentFee.toString()}
            inviter={{
              score: creator.score,
              avatar: creator.profileImage?.url,
              name: `${creator.firstName} ${creator.lastName}`,
            }}
            close={() => {}}
          />
        );
      })}
    </div>
  );
};
