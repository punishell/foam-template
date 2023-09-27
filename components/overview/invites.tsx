import React from 'react';
import { JobFeedCard } from './feedViewer';
import { useGetInvites } from '@/lib/api/invites';
import { PageEmpty } from '@/components/common/page-empty';
import { PageError } from '@/components/common/page-error';
import { PageLoading } from '@/components/common/page-loading';

export const Invites = () => {
  const query = useGetInvites({});

  if (query.isLoading) return <PageLoading className="rounded-xl border border-line" />;

  if (query.isError) return <PageError className="rounded-xl border border-red-100" />;

  const invites = query.data.data;

  if (invites.length === 0) return <PageEmpty />;

  return (
    <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">
      {invites.map(({ _id: inviteId, data }) => {
        const { creator, name, _id: jobId, paymentFee } = data;
        return (
          <JobFeedCard
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
          />
        );
      })}
    </div>
  );

  // const { data: inviteData, isFetched, isFetching } = useGetInvites({});
  // console.log('inviteData', inviteData);
  // const invites = useMemo(
  //   () =>
  //     (inviteData?.data || []).map((feed, i) => (
  //       <JobFeedCard
  //         key={i}
  //         title={feed?.data?.name}
  //         type={'job-invite-pending'}
  //         amount={feed?.data?.paymentFee || 0}
  //         id={feed?.data?._id}
  //         _id={feed?._id}
  //         invitationExpiry={feed?.data?.expiresAt}
  //         inviter={{
  //           avatar: feed?.data?.creator?.profileImage?.url || '',
  //           name: `${feed?.data?.creator?.firstName || ''} ${feed?.data?.creator?.lastName || ''}`,
  //           score: feed?.data?.creator?.score || 0,
  //         }}
  //       />
  //     )),
  //   [inviteData?.data],
  // );
  // if (isFetching && !isFetched)
  //   return (
  //     <div className="flex flex-col gap-5 mt-4 rounded-2xl p-4 w-full">
  //       <Spinner />
  //     </div>
  //   );
  // if (invites.length === 0)
  //   return (
  //     <div className="flex flex-col gap-5 mt-4 w-full p-4">
  //       <p className="text-center">No Invites Received</p>
  //     </div>
  //   );
  // return <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">{invites}</div>;
};
