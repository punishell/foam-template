import React, { useMemo } from 'react';

import { useGetInvites } from '@/lib/api/invites';
import { JobFeedCard } from './feedViewer';
import { Spinner } from '../common';

export const Invites = () => {
  const { data: inviteData, isFetched, isFetching } = useGetInvites({ page: 1, limit: 10, filter: { status: "pending" } });

  const invites = useMemo(() => (inviteData?.data || []).map((feed, i) =>
    <JobFeedCard
      key={i}
      title={feed?.data?.name}
      type={"job-invite-pending"}
      amount={feed?.data?.paymentFee || 0}
      id={feed?.data?._id}
      _id={feed?._id}
      invitationExpiry={feed?.data?.expiresAt}
      inviter={{
        avatar: feed?.data?.creator?.profileImage?.url || "",
        name: `${feed?.data?.creator?.firstName || ""} ${feed?.data?.creator?.lastName || ""}`,
        score: feed?.data?.creator?.score || 0,
      }}
    />
  ), [inviteData?.data]);

  if (isFetching && !isFetched) return <div className="flex flex-col gap-5 mt-4 rounded-2xl p-4 w-full"><Spinner /></div>;
  if (invites.length === 0) return <div className='flex flex-col gap-5 mt-4 w-full p-4'><p className='text-center'>No Invites Received</p></div>

  return (
    <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">
      {invites}
    </div>
  );
};