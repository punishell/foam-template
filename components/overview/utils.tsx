import React from 'react';

import { FEED_TYPES } from '@/lib/utils';

import {
  JobFeedCard,
  PublicJobCreatedFeed,
  ReferralSignupFeed,
  ReferralJobCompletion,
  PaymentReleased,
  JobCompletionFeed,
  JobReviewedFeed,
  JobCancelled,
  IssueResolutionRaiseFeed,
  IssueResolutionResolveFeed,
  IssueResolutionRejectFeed,
  SecondIssueResolutionRejectFeed,
  JuryInvitationFeed,
  JobApplicationCard,
  JobUpdateFeed,
  ReviewChangeCard,
} from './feedViewer';
import { DataFeedResponse } from '@/lib/types';

export const ParseFeedView = (feed: DataFeedResponse, loggedInUser: string, key: number, callback?: () => void, dismissFeed?: (id: string) => void) => {

  const amount = String(feed?.data?.paymentFee);
  const isBookmarked = feed.isBookmarked || false;
  const bookmarkId = feed.bookmarkId || feed._id;
  const DismissByID = (id: string) => dismissFeed && dismissFeed(id);

  const inviter = {
    _id: feed?.data?.creator?._id || '',
    avatar: feed?.data?.creator?.profileImage?.url || '',
    name: `${feed?.data?.creator?.firstName || ''} ${feed?.data?.creator?.lastName || ''}`,
    score: feed?.data?.creator?.score || 0,
  };

  const talent = {
    _id: feed?.data?.owner?._id || '',
    avatar: feed?.data?.owner?.profileImage?.url || '',
    name: `${feed?.data?.owner?.firstName || ''} ${feed?.data?.owner?.lastName || ''}`,
    score: feed?.data?.owner?.score || 0,
  };
  const deliverableTotal = feed?.data?.collections.filter(f => f.type == "deliverable").length;
  const deliverableTotalCompleted = feed?.data?.collections.filter(f => (f.type == "deliverable" && f.progress == 100)).length;
  const currentProgress = parseInt(String(deliverableTotalCompleted * 100 / deliverableTotal));
  const deliverableCountPercentage = {
    total: deliverableTotal,
    progress: currentProgress,
  }
  switch (feed.type) {
    case FEED_TYPES.COLLECTION_CREATED:
    case FEED_TYPES.PUBLIC_JOB_CREATED:
      return <PublicJobCreatedFeed
        key={key}
        creator={inviter}
        amount={amount}
        jobId={feed?.data?._id}
        title={feed?.title}
        _id={feed?._id}
        bookmark={{ active: isBookmarked, id: bookmarkId }}
        callback={callback}
        close={(id: string) => DismissByID(id)}
      />;
    case FEED_TYPES.COLLECTION_INVITE:
    case FEED_TYPES.JOB_INVITATION_RECEIVED:
      return (
        <JobFeedCard
          key={key}
          id={feed._id}
          title={feed?.title}
          type="job-invite-pending"
          amount={amount}
          inviteId={feed?.data?.invite?._id || ""}
          inviter={inviter}
          jobId={feed?.data?._id}
          bookmarked={isBookmarked}
          close={DismissByID}
        />
      );
    case FEED_TYPES.JOB_APPLICATION_SUBMITTED:
      return <JobApplicationCard
        key={key}
        id={feed?._id}
        title={feed?.data?.parent?.name || ""}
        applicant={{
          name: `${feed?.data?.creator.firstName} ${feed?.data?.creator?.lastName}`,
          avatar: feed?.data?.creator?.profileImage?.url || "",
          score: feed?.data?.creator?.score,
        }}
        bookmarked={isBookmarked}
        jobId={feed?.data?.parent?._id || ""}
        close={DismissByID}
      />;
    case FEED_TYPES.JOB_INVITATION_ACCEPTED || FEED_TYPES.JOB_INVITATION_DECLINED:
      return <JobFeedCard
        key={key}
        title={feed?.data?.name}
        type="job-invite-response"
        accepted={!!FEED_TYPES.JOB_INVITATION_ACCEPTED}
        inviter={inviter}
        id={feed?._id}
        bookmarked={isBookmarked}
        close={DismissByID}
      />;
    case FEED_TYPES.JOB_DELIVERABLE_UPDATE || FEED_TYPES.COLLECTION_UPDATE:
      return <JobUpdateFeed
        key={key}
        talent={talent}
        creator={inviter}
        id={feed?._id}
        title={feed?.title}
        description={feed?.data?.description}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
        close={DismissByID}
        jobId={feed?.data?._id}
        progress={deliverableCountPercentage}
        isCreator={feed?.data?.creator?._id === loggedInUser}
        jobTitle={feed.data.name}
      />;
    case FEED_TYPES.JOB_COMPLETION:
      return;
    case FEED_TYPES.REFERRAL_SIGNUP:
      return <ReferralSignupFeed
        key={key}
        id={feed?._id} name={`${feed?.creator?.firstName || ''} ${feed?.creator?.lastName || ''}`}
        title={feed?.title}
        description={feed?.description}
        avatar={feed?.creator?.profileImage?.url}
        userId={feed?.creator?._id}
        score={feed?.creator?.score}
        close={DismissByID}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
      />;
    case FEED_TYPES.JOB_REVIEW:
      return <JobReviewedFeed
        key={key}
        id={feed?._id}
        talent={talent}
        creator={inviter}
        jobId={feed?.data?._id}
        isCreator={feed?.data?.creator?._id === loggedInUser}
        title={feed?.data?.name}
        description={feed?.description}
        close={DismissByID}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
      />;
    case FEED_TYPES.REFERRAL_COLLECTION_COMPLETION:
      return <ReferralJobCompletion
        key={key}
        id={feed?._id}
        talent={talent}
        jobId={feed?.data?._id}
        close={DismissByID}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
        title={feed?.data?.name}
        rating={feed?.meta?.rating}
      />;
    case FEED_TYPES.JOB_PAYMENT_RELEASED:
      return <PaymentReleased
        key={key}
        id={feed?._id}
        talent={talent}
        creator={inviter}
        jobId={feed?.data?._id}
        isCreator={feed?.data?.creator?._id === loggedInUser}
        amount={String(feed?.data?.paymentFee)}
        description={feed?.description}
        close={DismissByID}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
        title={feed?.title}
      />;
    case FEED_TYPES.COLLECTION_COMPLETED:
    case FEED_TYPES.JOB_COMPLETION:
      return <JobCompletionFeed
        key={key}
        id={feed?._id}
        talent={talent}
        creator={inviter}
        jobId={feed?.data?._id}
        isCreator={feed?.data?.creator?._id === loggedInUser}
        close={DismissByID}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
        title={feed?.title}
      />;
    case FEED_TYPES.COLLECTION_CANCELLED:
    case FEED_TYPES.JOB_CANCELLED:
      return <JobCancelled
        key={key}
        id={feed?._id}
        talent={talent}
        creator={inviter}
        jobId={feed?.data?._id}
        isCreator={feed?.data?.creator?._id === loggedInUser}
        close={DismissByID}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
        title={feed?.title}
      />;

    case FEED_TYPES.JOB_CANCELLED_REQUEST:
      return <ReviewChangeCard
        key={key}
        id={feed?._id}
        talent={talent}
        creator={inviter}
        jobId={feed?.data?._id}
        isCreator={feed?.data?.creator?._id === loggedInUser}
        close={DismissByID}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
        title={`${talent.name} requested to cancel a job`}
        description={feed?.description}
      />;
    case FEED_TYPES.JOB_REVIEW_CHANGE:
      return <ReviewChangeCard
        key={key}
        id={feed?._id}
        talent={talent}
        creator={inviter}
        jobId={feed?.data?._id}
        isCreator={feed?.data?.creator?._id === loggedInUser}
        close={DismissByID}
        bookmarked={isBookmarked}
        bookmarkId={bookmarkId}
        title={`${talent.name} submitted a redo request`}
        description={feed?.description}
      />;

    // case FEED_TYPES.ISSUE_RAISED:
    //   return <IssueResolutionRaiseFeed />;
    // case FEED_TYPES.ISSUE_RESOLUTION_GUILTY:
    //   return <IssueResolutionRejectFeed />;
    // case FEED_TYPES.ISSUE_RESOLUTION_RESOLVED:
    //   return <IssueResolutionResolveFeed />;
    // case FEED_TYPES.ISSUE_RESOLUTION_GUILTY_SECOND:
    //   return <SecondIssueResolutionRejectFeed />;
    // case FEED_TYPES.JURY_INVITATION:
    //   return <JuryInvitationFeed />;
    default:
      return (
        <JobFeedCard
          key={key}
          title="Mobile UX Design for Afrofund"
          type="job-invite-filled"
          inviter={inviter}
          id={feed?._id}
          // amount={amount}
          // inviteId={feed?.data?.invite}
          // jobId={feed?.data?._id}
          bookmarked={isBookmarked}
          close={DismissByID}
        />
      );
  }
};
