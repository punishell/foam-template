import React from 'react';
import { Button } from 'pakt-ui';
import { useRouter } from 'next/navigation';
import { X, Bookmark, Briefcase, Clock4, Gavel } from 'lucide-react';
import Lottie from 'lottie-react';
import win from '@/lottiefiles/win.json';
import alert from '@/lottiefiles/alert.json';
import gavel from '@/lottiefiles/gavel.json';
import failed from '@/lottiefiles/failed.json';
import warning from '@/lottiefiles/warning.json';
import { RenderBookMark } from '@/components/jobs/job-cards/render-bookmark';
import Link from 'next/link';
import { DeliverableProgressBar } from '@/components/common/deliverable-progress-bar';
import { AfroProfile } from '@/components/common/afro-profile';
import { ClientJobModal } from '@/components/jobs/job-modals/client';
import { SideModal } from '@/components/common/side-modal';
interface JobInvitePendingProps {
  id: string;
  jobId: string;
  title: string;
  inviteId: string;
  amount: string;
  inviter: {
    name: string;
    avatar?: string;
    score: number;
  };
  imageUrl?: string;
  invitationExpiry?: string;
  bookmarked?: boolean;
  type: 'job-invite-pending';
  close?: (id: string) => void;
}

interface JobFilledProps {
  id: string;
  title: string;
  inviter: {
    name: string;
    avatar: string;
    score: number;
  };
  bookmarked: boolean;
  type: 'job-invite-filled';
  imageUrl?: string;
  close: (id: string) => void;
}

interface JobResponseProps {
  id: string;
  title: string;
  inviter: {
    name: string;
    avatar: string;
    score: number;
  };
  bookmarked: boolean;
  accepted: boolean;
  type: 'job-invite-response';
  imageUrl?: string;
  close: (id: string) => void;
}

type JobFeedCardProps = JobInvitePendingProps | JobFilledProps | JobResponseProps;

export const JobFeedCard: React.FC<JobFeedCardProps> = (props) => {
  const { type } = props;
  const router = useRouter();

  if (type === 'job-invite-filled') {
    const { id, title, bookmarked, inviter, close } = props;

    return (
      <JobFeedWrapper>
        <AfroProfile src={inviter.avatar} score={inviter.score} size="lg" />
        <div className="flex flex-col gap-4 py-4 w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-title text-xl font-bold">Job Filled</h3>

            {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
          </div>

          <p className="text-body">
            The <span className="text-title text-bold">&quot;{title}&quot;</span> Job you applied to has been filled.
            You can check out more public jobs that fit your profile
          </p>

          <div className="justify-between items-center flex mt-auto">
            <Link href={'/jobs'}>
              <Button size="xs" variant="secondary">
                See More Jobs
              </Button>
            </Link>
            <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={id} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }

  if (type === 'job-invite-pending') {
    const { id, title, amount, inviter, bookmarked, invitationExpiry, inviteId, jobId, close } = props;

    return (
      <JobFeedWrapper>
        <AfroProfile src={inviter.avatar} score={inviter.score} size="lg" />
        <div className="flex flex-col gap-4 w-full py-4">
          <div className="flex justify-between items-center">
            <span className="text-body text-xl font-bold">
              {inviter.name} Invited you to a{' '}
              <span className="px-2 text-lg text-title inline-flex rounded-full bg-[#B2E9AA66]">${amount}</span> job
            </span>

            <div className="flex items-center gap-2">
              {invitationExpiry && (
                <div className="flex gap-1 text-body items-center text-sm">
                  <Clock4 size={20} />
                  <span>Time left: 1:48:00</span>
                </div>
              )}
              {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
            </div>
          </div>

          <span className="text-title text-2xl font-normal">{title}</span>

          <div className="justify-between items-center flex mt-auto">
            <Link href={`/jobs/${jobId}?invite-id=${inviteId}`} className="flex items-center gap-2">
              <Button size="xs" variant="secondary">
                See Details
              </Button>
            </Link>

            <RenderBookMark size={20} isBookmarked={bookmarked} id={inviteId} type="feed" bookmarkId={inviteId} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }

  if (type === 'job-invite-response') {
    const { id, title, bookmarked, inviter, close, accepted } = props;

    return (
      <JobFeedWrapper>
        <AfroProfile src={inviter.avatar} score={inviter.score} size="lg" />

        <div className="flex flex-col gap-4 py-4 w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-title text-xl font-bold">Job Invitation {accepted ? 'Accepted' : 'Declined'}</h3>

            {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
          </div>

          <p className="text-body">
            The <span className="text-title text-bold">&quot;{title}&quot;</span> Job has been filled. You can check job
            progress here
          </p>

          <div className="justify-between items-center flex mt-auto">
            <Link href={`/jobs`}>
              <Button size="xs" variant="secondary">
                See Update
              </Button>
            </Link>
            <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={id} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }
};

type JobApplicationCardProps = {
  id: string;
  title: string;
  applicant: {
    name: string;
    avatar: string;
    score: number;
  };
  bookmarked: boolean;
  jobId: string;
  close: (id: string) => void;
};

export const JobApplicationCard: React.FC<JobApplicationCardProps> = (props) => {
  const { id, title, jobId, bookmarked, applicant, close } = props;

  return (
    <JobFeedWrapper>
      <AfroProfile src={applicant.avatar} score={applicant.score} size="lg" />
      <div className="flex flex-col gap-4 py-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">New Job Application</h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>

        <p className="text-body">
          You Have Received a new job application for <span className="text-title text-bold">&quot;{title}&quot;</span>{' '}
          from {applicant.name}
        </p>

        <div className="justify-between items-center flex mt-auto">
          <Link href={`/jobs/${jobId}/applicants`}>
            <Button size="xs" variant="secondary">
              View Applicants
            </Button>
          </Link>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={id} />
        </div>
      </div>
    </JobFeedWrapper>
  );
};

export const JobFeedWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="border-blue-lighter gap-4 px-4 pl-2 flex border bg-[#F1FBFF] z-10 w-full rounded-2xl relative overflow-hidden h-[174px]">
      {children}

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#C9F0FF" />
      </div>
    </div>
  );
};

export const PublicJobCreatedFeed = ({
  creator,
  title,
  amount,
  jobId,
  _id,
  bookmark,
  callback,
  close,
}: {
  creator: { name: string; avatar: string; score: number };
  title: string;
  amount: string;
  jobId: string;
  _id: string;
  bookmark: { active: boolean; id: string };
  callback?: () => void;
  close: (id: string) => void;
}) => {
  return (
    <JobFeedWrapper>
      <AfroProfile score={creator.score} src={creator.avatar} size="lg" />
      <div className="flex flex-col gap-4 w-full py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-body text-xl font-bold">
            {creator.name} created a{' '}
            <span className="px-2 text-lg text-title inline-flex rounded-full bg-green-300">${amount ?? 0}</span> public
            job
          </h3>
          <X size={20} className="cursor-pointer" onClick={() => close(_id)} />
        </div>
        <h3 className="text-title text-2xl font-normal">{title}</h3>
        <div className="justify-between items-center flex mt-auto">
          <Link href={`/jobs/${jobId}`} className="flex items-center gap-2">
            <Button size="xs" variant="outline">
              See Details
            </Button>
          </Link>
          <RenderBookMark
            size={20}
            isBookmarked={bookmark.active}
            type="feed"
            id={_id}
            bookmarkId={bookmark.id}
            callback={callback}
          />
        </div>
      </div>
    </JobFeedWrapper>
  );
};

interface TalentJobUpdateProps {
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
  close: (id: string) => void;
}

export const JobUpdateFeed: React.FC<TalentJobUpdateProps> = ({
  id,
  jobId,
  talent,
  creator,
  title,
  description,
  progress,
  bookmarked,
  isCreator,
  close,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 pl-2 px-4  flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile src={talent.avatar} score={talent.score} size="lg" />
      <div className="flex flex-col gap-4 py-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">
            {!isCreator ? title : `${talent.name} completed a deliverable`}
          </h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>
        <p className="text-body">{!isCreator ? description : `✅ ${title}`}</p>
        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2 w-full">
            {progress.progress === 100 && (
              <Button
                size="xs"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                See Update
              </Button>
            )}
            <Link href={`/messages?userId=${isCreator ? talent._id : creator._id}`}>
              <Button size="xs" variant="outline">
                Message
              </Button>
            </Link>
            <DeliverableProgressBar
              percentageProgress={progress.progress}
              totalDeliverables={progress.total}
              className="w-full"
            />
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={id} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>

      {isCreator && (
        <SideModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <ClientJobModal
            jobId={jobId}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          />
        </SideModal>
      )}
    </div>
  );
};

export const JobCompletionFeed = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 pl-2 px-4  flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile score={0} size="lg" />
      <div className="flex flex-col gap-4 w-full py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-body text-xl font-bold">Joon completed a job</h3>

          <X size={20} />
        </div>

        <p className="text-title text-3xl">Landing Page Design for Snowforte</p>

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

interface ReviewJobProps {
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
  close: (id: string) => void;
}
export const JobReviewedFeed: React.FC<ReviewJobProps> = ({
  id,
  jobId,
  talent,
  creator,
  title,
  description,
  bookmarked,
  isCreator,
  close,
}) => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 pl-2 px-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile src={isCreator ? talent.avatar : creator.avatar} score={0} size="lg" />
      <div className="flex flex-col gap-4 py-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">{isCreator ? talent.name : creator.name} has reviewed your work</h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>

        <p className="text-body">{description}</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
              Write Review
            </Button>
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={id} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
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
              View Wallet
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
    <div className="border-[#FF9898] gap-4 pl-2 px-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile score={0} size="lg" />
      <div className="flex flex-col gap-4 w-full py-4">
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
interface ReferralSignupFeedProps {
  id: string;
  name: string;
  userId: string;
  title?: string;
  description?: String;
  avatar?: string;
  score?: number;
  bookmarkId: string;
  bookmarked: boolean;
  close: (id: string) => void;
}

export const ReferralSignupFeed = ({
  id,
  title,
  description,
  userId,
  avatar,
  score,
  name,
  bookmarked,
  bookmarkId,
  close,
}: ReferralSignupFeedProps) => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden h-[174px]">
      <AfroProfile src={avatar} score={score ?? 0} size="lg" />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">{title ? title : `${name} just signed up`}</h3>
          <X size={20} className="cursor-pointer" onClick={() => close(id)} />
        </div>

        <p className="text-body">
          {description ? description : `Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
          support! 🙌`}
        </p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Link href={`/messages?userId=${userId}`}>
              <Button size="xs" variant="outline">
                Message
              </Button>
            </Link>
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
    </div>
  );
};

export const ReferralJobCompletion = () => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile score={0} size="lg" />
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

export const IssueResolutionRaiseFeed = () => {
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

export const JuryInvitationFeed = () => {
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

export const IssueResolutionRejectFeed = () => {
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

export const SecondIssueResolutionRejectFeed = () => {
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

export const IssueResolutionResolveFeed = () => {
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
