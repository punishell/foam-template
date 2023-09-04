import React, { useMemo } from 'react';
import { Button } from 'pakt-ui';
import { X, Bookmark, Briefcase, Clock4, Gavel } from 'lucide-react';
import { UserAvatar } from '../common/user-avatar';
import Lottie from 'lottie-react';

import win from '@/lottiefiles/win.json';
import alert from '@/lottiefiles/alert.json';
import gavel from '@/lottiefiles/gavel.json';
import failed from '@/lottiefiles/failed.json';
import warning from '@/lottiefiles/warning.json';
import { useDismissAllFeed, useDismissFeed, useGetTimeline } from '@/lib/api/dashboard';
import { FEED_TYPES } from '@/lib/utils';

export const Feeds = () => {
  const { data: timelineData, refetch: feedRefetch } = useGetTimeline({ page: 1, limit: 10, filter: {} });
  console.log(timelineData);

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

  const timelineFeeds = useMemo(() => (timelineData?.data || []).map((feeds) => ({
    title: feeds?.title,
    type: feeds?.type,
    inviter: {
      avatar: feeds?.data?.creator?.profileImage?.url || "",
      name: `${feeds?.data?.creator?.firstName || ""} ${feeds?.data?.creator?.lastName || ""}`,
      score: feeds?.data?.creator?.score || 0,
    },
    id: feeds?.data?._id,
    amount: feeds?.data?.paymentFee,
    dismissed: feeds?.closed,
  })), [timelineData?.data])

  console.log(timelineFeeds);
  return (
    <div className="flex flex-col gap-5 mt-4 border border-line bg-white rounded-2xl p-4 w-full">
      {timelineFeeds.map((feed, i) => {
        if (feed.type == FEED_TYPES.COLLECTION_CREATED)
          return <PublicJobCreatedFeed
            creator={feed.inviter.name}
            amount={feed?.amount}
            jobId={feed?.id}
            title={feed?.title}
          />
        return <JobFeedCard
          key={i}
          jobTitle="Mobile UX Design for Afrofund"
          type="job-invite-filled"
          jobInviter={{ avatar: '', name: 'Claire', paktScore: 50 }}
        />
      })}
      <JobFeedCard
        jobTitle="Mobile UX Design for Afrofund"
        type="job-invite-filled"
        jobInviter={{ avatar: '', name: 'Claire', paktScore: 50 }}
      />
      <JobFeedCard
        jobTitle="Mobile UX Design for Afrofund"
        type="private-job-invite"
        jobAmount={1500}
        jobId="1234"
        jobInviter={{ avatar: '', name: 'Claire', paktScore: 50 }}
      />
      <JobFeedCard
        jobId="1234"
        jobAmount={1500}
        type="public-job-invite"
        jobTitle="Mobile UX Design for Afrofund"
        invitationExpiry="2021-09-01T00:00:00.000Z"
        jobInviter={{ avatar: '', name: 'Claire', paktScore: 50 }}
      />
      <PublicJobCreatedFeed
        creator='Joan'
        amount="600"
        jobId='sdfdgf'
        title='SOftware System Update and Designs'
      />

      <TalentJobUpdateFeed />
      <JobDeliverableCompletionFeed />
      <JobCompletionFeed />
      <JobReviewedFeed />
      <JobCancelled />

      <PaymentReleased />

      <ReferralSignupFeed />
      <ReferralJobCompletion />

      <IssueResolutionRaiseFeed />
      <IssueResolutionResolveFeed />
      <IssueResolutionRejectFeed />
      <SecondIssueResolutionRejectFeed />
      <JuryInvitationFeed />
    </div>
  );
};

interface PrivateJobInviteProps {
  jobId: string;
  jobTitle: string;
  jobAmount: number;
  jobInviter: {
    name: string;
    avatar?: string;
    paktScore: number;
  };
  type: 'private-job-invite';
}

interface PublicJobInviteProps {
  jobId: string;
  jobTitle: string;
  jobAmount: number;
  jobInviter: {
    name: string;
    avatar?: string;
    paktScore: number;
  };
  invitationExpiry: string;
  type: 'public-job-invite';
}

interface JobFilledProps {
  jobTitle: string;
  jobInviter: {
    name: string;
    avatar: string;
    paktScore: number;
  };
  type: 'job-invite-filled';
}

type JobFeedCardProps = PrivateJobInviteProps | PublicJobInviteProps | JobFilledProps;

export const JobFeedCard: React.FC<JobFeedCardProps> = (props) => {
  const { type } = props;

  if (type === 'job-invite-filled') {
    const { jobTitle, jobInviter } = props;

    return (
      <JobFeedWrapper>
        <UserAvatar score={97} />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-title text-xl font-bold">Job Filled</h3>

            <X size={20} />
          </div>

          <p className="text-body">
            The <span className="text-title text-bold">&quot;{jobTitle}&quot;</span> Job you applied to has been filled.
            You can check out more public jobs that fit your profile
          </p>

          <div className="justify-between items-center flex mt-auto">
            <Button size="xs" variant="secondary">
              See More Jobs
            </Button>
            <Bookmark size={20} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }

  if (type === 'private-job-invite') {
    const { jobTitle, jobAmount, jobInviter, type, jobId } = props;

    return (
      <JobFeedWrapper>
        <UserAvatar score={75} />

        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center">
            <span className="text-body text-xl font-bold">
              {jobInviter.name} Invited you to a{' '}
              <span className="px-2 text-lg text-title inline-flex rounded-full bg-[#B2E9AA66]">${jobAmount}</span> job
            </span>

            <X size={20} />
          </div>

          <span className="text-title text-3xl font-normal">{jobTitle}</span>

          <div className="justify-between items-center flex mt-auto">
            <div className="flex items-center gap-2">
              <Button size="xs" variant="secondary">
                See Details
              </Button>
              <Button size="xs" variant="outline">
                Accept
              </Button>
            </div>
            <Bookmark size={20} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }

  if (type === 'public-job-invite') {
    const { jobTitle, jobAmount, jobInviter, type, jobId, invitationExpiry } = props;

    return (
      <JobFeedWrapper>
        <UserAvatar score={54} />

        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-body text-xl font-bold">
              {jobInviter.name} Invited you to a{' '}
              <span className="px-2 text-lg text-title inline-flex rounded-full bg-green-300">${jobAmount}</span> job
            </h3>

            <div className="flex items-center gap-2">
              <div className="flex gap-1 text-body items-center text-sm">
                <Clock4 size={20} />
                <span>Time left: 1:48:00</span>
              </div>
              <X size={20} />
            </div>
          </div>

          <h3 className="text-title text-3xl font-normal">{jobTitle}</h3>

          <div className="justify-between items-center flex mt-auto">
            <div className="flex items-center gap-2">
              <Button size="xs" variant="secondary">
                See Details
              </Button>
              <Button size="xs" variant="outline">
                Accept
              </Button>
            </div>
            <Bookmark size={20} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }
};

export const JobFeedWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="border-blue-lighter gap-4 p-4 flex border bg-[#F1FBFF] z-10 w-full rounded-2xl relative overflow-hidden">
      {children}

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#C9F0FF" />
      </div>
    </div>
  );
};

const PublicJobCreatedFeed = ({ creator, title, amount, jobId }: { creator: string, title: string, amount: string, jobId: string }) => {
  return (
    <JobFeedWrapper>
      <UserAvatar score={54} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-body text-xl font-bold">
            {creator} created a{" "}
            <span className="px-2 text-lg text-title inline-flex rounded-full bg-green-300">${amount}</span> public job
          </h3>
        </div>
        <h3 className="text-title text-3xl font-normal">{title}</h3>
        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Apply
            </Button>
            <Button size="xs" variant="outline">
              See Details
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>
    </JobFeedWrapper>
  );
};

const TalentJobUpdateFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Landing Page Design for a Lead Generation...</h3>

          <X size={20} />
        </div>

        <p className="text-body">
          The goal of this project is to create visually appealing and engaging materials that communicate
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              See Update
            </Button>
            <Button size="xs" variant="outline">
              Message
            </Button>
            <DeliverableProgressBar />
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

const JobDeliverableCompletionFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Joon completed a deliverable</h3>

          <X size={20} />
        </div>

        <p className="text-body">
          ✅ Initial design concepts for the email newsletter to provide a clear understanding of how the final design
          will look like.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              See Update
            </Button>
            <Button size="xs" variant="outline">
              Message
            </Button>
            <DeliverableProgressBar />
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

const JobCompletionFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-body text-xl font-bold">Joon completed a job</h3>

          <X size={20} />
        </div>

        <p className="text-title text-3xl">Landing Page Design for Snowforte</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Update
            </Button>
            <Button size="xs" variant="outline">
              Message
            </Button>
            <DeliverableProgressBar />
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

export const JobReviewedFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Theresa has reviewed your work</h3>

          <X size={20} />
        </div>

        <p className="text-body">
          Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit
          dolore cillum minim tempor enim...
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Write Review
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

const DeliverableProgressBar = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="bg-primary-gradient rounded-full h-2 w-[60px]"></div>
      <div className="bg-primary-gradient rounded-full h-2 w-[60px]"></div>
      <div className="bg-primary-gradient rounded-full h-2 w-[60px]"></div>
      <div className="bg-line rounded-full h-2 w-[60px]"></div>
      <div className="bg-line rounded-full h-2 w-[60px]"></div>
    </div>
  );
};

export const PaymentReleased = () => {
  return (
    <div className="border-[#7DDE86] bg-[#FBFFFA] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-body text-xl font-bold">Payment Released</h3>

          <X size={20} />
        </div>

        <p className="text-title text-3xl">$4000 has been added to Your Wallet! 💰</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Vie Wallet
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#ECFCE5" />
      </div>
    </div>
  );
};

export const JobCancelled = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Theresa Cancelled the Job</h3>

          <X size={20} />
        </div>

        <p className="text-body text-3xl">Landing Page Design for Snowforte</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Details
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

const ReferralSignupFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Williamson just signed up</h3>

          <X size={20} />
        </div>

        <p className="text-body">
          Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
          support! 🙌
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="outline">
              Message
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

const ReferralJobCompletion = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <UserAvatar score={75} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Shola completed a job</h3>

          <X size={20} />
        </div>

        <p className="text-body text-3xl">Dashboard Design for Lala land</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="outline">
              See Review
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

const IssueResolutionRaiseFeed = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={alert} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">Jane Cooper Has Raised An Issue</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          Your job “Design of landing page” has been submitted for Issue Resolution arbitration. You have 48 hours to
          submit materials to defend your case to the 5-person jury.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Details
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

const JuryInvitationFeed = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={gavel} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">You’ve Been Invited To Serve On A Jury</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          You have two days to accept this invitation. Participating will increase your Afroscore by 1 Point. Declining
          will cost 1 Point.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Details
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

const IssueResolutionRejectFeed = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={warning} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">You Lost Your Issue Resolution</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          After thorough review of the provided evidence for the [job] issue, the jury decided that you were in the
          wrong.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Verdict
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

const SecondIssueResolutionRejectFeed = () => {
  return (
    <div className="border-[#FF9898] gap-4 p-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={failed} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">You lost your second Issue Resolution</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          After thorough review of the provided evidence, the jury decided that you were in the wrong of this case.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Verdict
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#FFE5E5" />
      </div>
    </div>
  );
};

const IssueResolutionResolveFeed = () => {
  return (
    <div className="border-[#7DDE86] bg-[#FBFFFA] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <div className="w-[148px] flex items-center justify-center">
        <Lottie animationData={win} loop={true} />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">You Won Your Issue Resolution</h3>

          <X size={20} />
        </div>

        <p className="text-body text-base">
          After thorough review of the provided evidence for the [job] issue, the jury decided that you were correct.
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="primary">
              See Verdict
            </Button>
          </div>
          <Bookmark size={20} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Gavel size={200} color="#ECFCE5" />
      </div>
    </div>
  );
};
