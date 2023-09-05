import React, { useMemo } from 'react';

import { useDismissAllFeed, useDismissFeed, useGetTimeline } from '@/lib/api/dashboard';
import { FEED_TYPES } from '@/lib/utils';
import { JobFeedCard, PublicJobCreatedFeed, ReferralSignupFeed, ReferralJobCompletion, PaymentReleased, TalentJobUpdateFeed, JobDeliverableCompletionFeed, JobCompletionFeed, JobReviewedFeed, JobCancelled, IssueResolutionRaiseFeed, IssueResolutionResolveFeed, IssueResolutionRejectFeed, SecondIssueResolutionRejectFeed, JuryInvitationFeed } from './feedViewer';
import { Spinner } from '../common';
import { useUserState } from '@/lib/store/account';

const ParseFeedView = (feed: any, loggedInUser: string) => {
  const amount = feed?.data?.paymentFee;
  const inviter = {
    avatar: feed?.data?.creator?.profileImage?.url || "",
    name: `${feed?.data?.creator?.firstName || ""} ${feed?.data?.creator?.lastName || ""}`,
    score: feed?.data?.creator?.score || 0,
  }
  switch (feed.type) {
    case FEED_TYPES.COLLECTION_CREATED:
      return <PublicJobCreatedFeed
        creator={`${feed?.data?.creator?.firstName || ""} ${feed?.data?.creator?.lastName || ""}`}
        amount={amount}
        jobId={feed?.data?.id}
        title={feed?.title}
      />;
    case FEED_TYPES.COLLECTION_INVITE:
      return <JobFeedCard
        title={feed?.title}
        type="job-invite-pending"
        amount={amount}
        // invitationExpiry={feed?.expiresAt}
        id={feed?.data?.id}
        inviter={inviter}
      />;
    case FEED_TYPES.REFERRAL_SIGNUP:
      return <ReferralSignupFeed
        name={`${feed?.creator?.firstName || ""} ${feed?.creator?.lastName || ""}`}
      />;
    case FEED_TYPES.REFERRAL_COLLECTION_COMPLETION:
      return <ReferralJobCompletion />;
    case FEED_TYPES.PAYMENT_RELEASED:
      return <PaymentReleased />;
    case FEED_TYPES.COLLECTION_UPDATE:
      return feed?.data?.owner?._id === loggedInUser ? <TalentJobUpdateFeed /> : <JobDeliverableCompletionFeed />;
    case FEED_TYPES.COLLECTION_REVIEWED:
      return <JobReviewedFeed />;
    case FEED_TYPES.COLLECTION_COMPLETED:
      return <JobCompletionFeed />;
    case FEED_TYPES.COLLECTION_CANCELLED:
      return <JobCancelled />
    case FEED_TYPES.ISSUE_RAISED:
      return <IssueResolutionRaiseFeed />
    case FEED_TYPES.ISSUE_RESOLUTION_GUILTY:
      return <IssueResolutionRejectFeed />;
    case FEED_TYPES.ISSUE_RESOLUTION_RESOLVED:
      return <IssueResolutionResolveFeed />
    case FEED_TYPES.ISSUE_RESOLUTION_GUILTY_SECOND:
      return <SecondIssueResolutionRejectFeed />;
    case FEED_TYPES.JURY_INVITATION:
      return <JuryInvitationFeed />;
    default:
      return <JobFeedCard
        title="Mobile UX Design for Afrofund"
        type="job-invite-filled"
        inviter={inviter}
      />;
  }
}

export const Feeds = () => {
  const { _id: loggedInUser } = useUserState()
  const { data: timelineData, refetch: feedRefetch, isFetching, isFetched } = useGetTimeline({ page: 1, limit: 10, filter: {} });

  // @ts-ignore
  const DismissAll = () => useDismissAllFeed().mutate({}, {
    onSuccess: () => {
      // refetch feeds
      feedRefetch();
    }
  });

  const DismissByID = (id: string) => useDismissFeed().mutate(id, {
    onSuccess: () => {
      // refetch feeds
      feedRefetch();
    }
  });

  const timelineFeeds = useMemo(() => (timelineData?.data || []).map((feed, i) => ParseFeedView(feed, loggedInUser)), [timelineData?.data])

  if (isFetching && !isFetched) return <div className="flex flex-col gap-5 mt-4 rounded-2xl p-4 w-full"><Spinner /></div>

  return (
    <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">
      {timelineFeeds}
    </div>
  );
};