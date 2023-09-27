import React from 'react';

import { FEED_TYPES } from '@/lib/utils';
import {
  JobFeedCard,
  PublicJobCreatedFeed,
  ReferralSignupFeed,
  ReferralJobCompletion,
  PaymentReleased,
  TalentJobUpdateFeed,
  JobDeliverableCompletionFeed,
  JobCompletionFeed,
  JobReviewedFeed,
  JobCancelled,
  IssueResolutionRaiseFeed,
  IssueResolutionResolveFeed,
  IssueResolutionRejectFeed,
  SecondIssueResolutionRejectFeed,
  JuryInvitationFeed,
} from './feedViewer';
import { DataFeedResponse } from '@/lib/api/dashboard';

export const ParseFeedView = (feed: DataFeedResponse, loggedInUser: string, key: number) => {
  const amount = feed?.data?.paymentFee;
  const isBookmarked = feed.isBookmarked;
  const inviter = {
    avatar: feed?.data?.creator?.profileImage?.url || '',
    name: `${feed?.data?.creator?.firstName || ''} ${feed?.data?.creator?.lastName || ''}`,
    score: feed?.data?.creator?.score || 0,
  };
  switch (feed.type) {
    case FEED_TYPES.COLLECTION_CREATED:
      return (
        <PublicJobCreatedFeed
          key={key}
          creator={`${feed?.data?.creator?.firstName || ''} ${feed?.data?.creator?.lastName || ''}`}
          amount={amount}
          jobId={feed?.data?._id}
          title={feed?.title}
          _id={feed?._id}
          bookmarked={isBookmarked}
          imageUrl={feed?.data?.creator?.profileImage?.url}
        />
      );
    case FEED_TYPES.COLLECTION_INVITE:
      return (
        <JobFeedCard
          title={feed?.title}
          type="job-invite-pending"
          amount={amount}
          // invitationExpiry={feed?.expiresAt}
          inviteId={feed?.data?._id}
          inviter={inviter}
          jobId={feed._id}
          bookmarked={isBookmarked}
          // imageUrl={feed?.data?.creator?.profileImage?.url}
        />
      );
    case FEED_TYPES.REFERRAL_SIGNUP:
      return <ReferralSignupFeed name={`${feed?.creator?.firstName || ''} ${feed?.creator?.lastName || ''}`} />;
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
      return <JobCancelled />;
    case FEED_TYPES.ISSUE_RAISED:
      return <IssueResolutionRaiseFeed />;
    case FEED_TYPES.ISSUE_RESOLUTION_GUILTY:
      return <IssueResolutionRejectFeed />;
    case FEED_TYPES.ISSUE_RESOLUTION_RESOLVED:
      return <IssueResolutionResolveFeed />;
    case FEED_TYPES.ISSUE_RESOLUTION_GUILTY_SECOND:
      return <SecondIssueResolutionRejectFeed />;
    case FEED_TYPES.JURY_INVITATION:
      return <JuryInvitationFeed />;
    default:
      return (
        <JobFeedCard
          title="Mobile UX Design for Afrofund"
          type="job-invite-filled"
          inviter={inviter}
          id={feed?._id}
          bookmarked={false}
        />
      );
  }
};
