import React from 'react';
import { Button } from 'pakt-ui';
import { useRouter } from 'next/navigation';
import { X, Bookmark, Briefcase, Clock4, Gavel, Star } from 'lucide-react';
import Rating from 'react-rating';
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
import { TalentJobModal } from '../jobs/job-modals/talent';
import { CheckBox } from '../common/checkBox';

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

interface JobInvitePendingProps {
  id: string;
  jobId: string;
  title: string;
  inviteId: string;
  amount: string;
  inviter: {
    _id: string;
    name: string;
    avatar?: string;
    score: number;
  };
  imageUrl?: string;
  invitationExpiry?: string;
  bookmarked?: boolean;
  bookmarkId: string;
  type: 'job-invite-pending';
  close?: (id: string) => void;
}

interface JobFilledProps {
  id: string;
  title: string;
  inviter: {
    _id: string;
    name: string;
    avatar: string;
    score: number;
  };
  bookmarked: boolean;
  bookmarkId: string;
  type: 'job-invite-filled';
  imageUrl?: string;
  close?: (id: string) => void;
}

interface JobResponseProps {
  id: string;
  title: string;
  jobId: string;
  talent: {
    _id: string;
    name: string;
    avatar: string;
    score: number;
  };
  bookmarkId: string;
  bookmarked: boolean;
  accepted: boolean;
  cancelled: boolean;
  type: 'job-invite-response';
  imageUrl?: string;
  close?: (id: string) => void;
}

type JobFeedCardProps = JobInvitePendingProps | JobFilledProps | JobResponseProps;

export const JobFeedCard: React.FC<JobFeedCardProps> = (props) => {
  const { type } = props;
  const router = useRouter();

  if (type === 'job-invite-filled') {
    const { id, title, bookmarked, bookmarkId, inviter, close } = props;

    return (
      <JobFeedWrapper>
        <AfroProfile src={inviter.avatar} score={inviter.score} size="lg" url={`/talents/${inviter._id}`} />
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
            <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }

  if (type === 'job-invite-pending') {
    const { id, title, amount, inviter, bookmarked, invitationExpiry, inviteId, jobId, bookmarkId, close } = props;
    return (
      <JobFeedWrapper>
        <AfroProfile src={inviter.avatar} score={inviter.score} size="lg" url={`/talents/${inviter._id}`} />
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

            <RenderBookMark size={20} isBookmarked={bookmarked} id={id} type="feed" bookmarkId={String(bookmarkId)} />
          </div>
        </div>
      </JobFeedWrapper>
    );
  }

  if (type === 'job-invite-response') {
    const { id, title, bookmarked, bookmarkId, talent, jobId, close, accepted, cancelled } = props;
    return (
      <JobFeedWrapper>
        <AfroProfile src={talent.avatar} score={talent.score} size="lg" url={`/talents/${talent._id}`} />

        <div className="flex flex-col gap-4 py-4 w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-title text-xl font-bold">Job Invitation {cancelled ? "cancelled" : accepted ? 'Accepted' : 'Declined'}</h3>

            {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
          </div>

          <p className="text-body">
            {talent.name} has {cancelled ? "cancelled" : accepted ? 'Accepted' : 'Declined'} <span className="text-title text-bold">&quot;{title}&quot;</span> Job. You can check job here
          </p>

          <div className="justify-between items-center flex mt-auto">
            <Link href={`/jobs/${jobId}`}>
              <Button size="xs" variant="secondary">
                See Update
              </Button>
            </Link>
            <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
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
    _id: string;
    name: string;
    avatar: string;
    score: number;
  };
  bookmarked: boolean;
  bookmarkId: string;
  jobId: string;
  close?: (id: string) => void;
};
export const JobApplicationCard: React.FC<JobApplicationCardProps> = (props) => {
  const { id, title, jobId, bookmarked, bookmarkId, applicant, close } = props;

  return (
    <JobFeedWrapper>
      <AfroProfile src={applicant.avatar} score={applicant.score} size="lg" url={`/talents/${applicant._id}`} />
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
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
        </div>
      </div>
    </JobFeedWrapper>
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
  creator: { _id: string, name: string; avatar: string; score: number };
  title: string;
  amount: string;
  jobId: string;
  _id: string;
  bookmark: { active: boolean; id: string };
  callback?: () => void;
  close?: (id: string) => void;
}) => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 pl-2 px-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile score={creator.score} src={creator.avatar} size="lg" url={`/talents/${creator._id}`} />
      <div className="flex flex-col gap-4 w-full py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-body text-xl font-bold">
            {creator.name} created a{' '}
            <span className="px-2 text-lg text-title inline-flex rounded-full bg-green-300">${amount ?? 0}</span> public
            job
          </h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(_id)} />}
        </div>
        <h3 className="text-title text-2xl font-normal">{title}</h3>
        <div className="justify-between items-center flex mt-auto">
          <Link href={`/jobs/${jobId}`} className="flex items-center gap-2">
            <Button size="xs" variant="secondary">
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
    </div>
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
  jobTitle?: string;
  isMarked: boolean;
  close?: (id: string) => void;
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
  bookmarkId,
  isCreator,
  jobTitle,
  isMarked,
  close,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="border-[#9BDCFD] bg-[#F1FBFF] gap-4 pl-2 px-4  flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile src={talent.avatar} score={talent.score} size="lg" url={`/talents/${talent._id}`} />
      <div className="flex flex-col gap-4 py-4 w-full">
        <div className="flex justify-between">
          <h3 className="text-title text-xl items-center w-[90%]">
            {!isCreator ? title : `${talent.name} ${isMarked ? "completed" : "Unchecked"} a deliverable on `} <span className='font-bold'>{jobTitle}</span>
          </h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>
        {/* <p className="text-body">{!isCreator ? description : `✅ ${description}`}</p> */}
        <p className="text-body flex gap-4 flex-row capitalize"> <CheckBox isChecked={isMarked} /> {description}</p>
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
              className="w-full max-w-[300px]"
            />
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>


      <SideModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        {isCreator ?
          <ClientJobModal
            jobId={jobId}
            talentId={talent._id}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          /> :
          <TalentJobModal
            jobId={jobId}
            talentId={talent._id}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          />
        }
      </SideModal>
    </div>
  );
};

interface JobCompletedProps {
  id: string;
  title: string;
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
  close?: (id: string) => void;
}
export const JobCompletionFeed: React.FC<JobCompletedProps> = ({
  id,
  jobId,
  talent,
  creator,
  title,
  bookmarked,
  bookmarkId,
  isCreator,
  close,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <div className="border-[#9BDCFD] bg-[#F1FBFF] gap-4 pl-2 px-4  flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile src={isCreator ? talent.avatar : creator.avatar} score={isCreator ? talent.score : creator.score} size="lg" url={`/talents/${isCreator ? talent._id : creator._id}`} />
      <div className="flex flex-col gap-4 w-full py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-body text-xl font-bold">{talent.name} completed all deliverables</h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>
        <p className="text-title text-3xl">{title}</p>
        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary" onClick={() => {
              setIsModalOpen(true);
            }}>
              Write Review
            </Button>
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
        </div>
      </div>
      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
      <SideModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        {isCreator ?
          <ClientJobModal
            jobId={jobId}
            talentId={talent._id}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          /> :
          <TalentJobModal
            jobId={jobId}
            talentId={talent._id}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          />
        }
      </SideModal>
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
  close?: (id: string) => void;
}
export const JobReviewedFeed: React.FC<ReviewJobProps> = ({
  id,
  jobId,
  talent,
  creator,
  title,
  description,
  bookmarked,
  bookmarkId,
  isCreator,
  close,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <div className="border-[#9BDCFD] bg-[#F1FBFF] gap-4 pl-2 px-4 flex border z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile src={isCreator ? talent.avatar : creator.avatar} score={isCreator ? talent.score : creator.score} size="lg" url={`/talents/${isCreator ? talent._id : creator._id}`} />
      <div className="flex flex-col gap-4 py-4 w-full">
        <div className="flex justify-between">
          <h3 className="text-title text-xl w-[90%] items-center">{isCreator ? talent.name : creator.name} has reviewed your work on <span className='font-bold'>{title}</span></h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>

        <p className="text-body">{description}</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="secondary" onClick={() => {
              setIsModalOpen(true);
            }}>
              Write Review
            </Button>
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>
      <SideModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        {isCreator ?
          <ClientJobModal
            jobId={jobId}
            talentId={talent._id}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          /> :
          <TalentJobModal
            jobId={jobId}
            talentId={talent._id}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          />
        }
      </SideModal>
    </div>
  );
};

interface PaymentReleasedProps {
  id: string;
  amount: string;
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
  close?: (id: string) => void;
}
export const PaymentReleased: React.FC<PaymentReleasedProps> = ({
  id,
  jobId,
  talent,
  creator,
  title,
  amount,
  description,
  bookmarked,
  bookmarkId,
  isCreator,
  close,
}) => {
  return (
    <div className="border-[#7DDE86] bg-[#FBFFFA] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile src={isCreator ? talent.avatar : creator.avatar} score={isCreator ? talent.score : creator.score} size="lg" url={`/talents/${isCreator ? talent._id : creator._id}`} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-body text-xl font-bold">{isCreator ? "Job Completed" : "Payment Released"}</h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>


        <p className="text-title text-3xl">{isCreator ? `${title}` : `$${amount} has been added to Your Wallet! 💰`}</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Link href="/wallet">
              <Button size="xs" variant="secondary">
                View Wallet
              </Button>
            </Link>
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#ECFCE5" />
      </div>
    </div>
  );
};

interface JobCancelledProps {
  id: string;
  title: string;
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
  close?: (id: string) => void;
}
export const JobCancelled: React.FC<JobCancelledProps> = ({
  id,
  jobId,
  talent,
  creator,
  title,
  bookmarked,
  bookmarkId,
  isCreator,
  close,
}) => {
  return (
    <div className="border-[#FF9898] gap-4 pl-2 px-4 flex border bg-[#FFF4F4] z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile src={isCreator ? talent.avatar : creator.avatar} score={isCreator ? talent.score : creator.score} size="lg" url={`/talents/${isCreator ? talent._id : creator._id}`} />
      <div className="flex flex-col gap-4 w-full py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">{creator.name} Cancelled the Job</h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>
        <p className="text-body text-3xl">{title}</p>
        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Link href={`/job/${jobId}`}>
              <Button size="xs" variant="primary">
                See Details
              </Button>
            </Link>
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
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
  close?: (id: string) => void;
}
export const ReferralSignupFeed: React.FC<ReferralSignupFeedProps> = ({
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
}) => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden h-[174px]">
      <AfroProfile src={avatar} score={Number(score)} size="lg" url={`/talents/${userId}`} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">{title ? title : `${name} just signed up`}</h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>

        <p className="text-body">
          {description
            ? description
            : `Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
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

interface ReferralJobCompletionProps {
  id: string;
  title: string;
  talent: {
    _id: string;
    name: string;
    avatar: string;
    score: number;
  };
  bookmarked: boolean;
  bookmarkId: string;
  rating: number;
  jobId: string;
  close?: (id: string) => void;
}
export const ReferralJobCompletion: React.FC<ReferralJobCompletionProps> = ({
  id,
  jobId,
  talent,
  title,
  bookmarked,
  bookmarkId,
  rating,
  close,
}) => {
  return (
    <div className="border-[#CDCFD0] bg-[#F9F9F9] gap-4 p-4 flex border  z-10 w-full rounded-2xl relative overflow-hidden">
      <AfroProfile src={talent.avatar} score={talent.score} size="lg" url={`/talents/${talent._id}`} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">{talent.name} a {
            // @ts-ignore
            <Rating
              readonly
              initialRating={rating || 0}
              fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
              emptySymbol={<Star fill="transparent" color="#15D28E" />}
            />
          } completed a job</h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>
        <p className="text-body text-3xl">{title}</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="outline">
              See Review
            </Button>
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

// review cards
interface ReviewChangeProps {
  id: string;
  title: string;
  description: string;
  talent: {
    _id: string;
    name: string;
    avatar: string;
    score: number;
  };
  creator: {
    _id: string;
    name: string;
    avatar: string;
    score: number;
  };
  bookmarked: boolean;
  bookmarkId: string;
  jobId: string;
  isCreator: boolean;
  close?: (id: string) => void;
}
export const ReviewChangeCard: React.FC<ReviewChangeProps> = ({
  id,
  title,
  jobId,
  description,
  creator,
  talent,
  bookmarked,
  bookmarkId,
  isCreator,
  close,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <div className="border-[#FF5247] bg-[#FFF4F4] gap-4 p-4 flex border z-10 w-full rounded-2xl relative overflow-hidden h-[174px]">
      <AfroProfile src={isCreator ? talent.avatar : creator.avatar} score={isCreator ? talent.score : creator.score} size="lg" url={`/talents/${isCreator ? talent._id : creator._id}`} />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-title text-xl font-bold">{title}</h3>
          {close && <X size={20} className="cursor-pointer" onClick={() => close(id)} />}
        </div>

        <p className="text-body">{description}</p>

        <div className="justify-between items-center flex mt-auto">
          <div className="flex items-center gap-2">
            <Button size="xs" variant="outline" onClick={() => setIsModalOpen(true)}>
              View Request
            </Button>
          </div>
          <RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
        </div>
      </div>

      <div className="absolute right-0 -z-[1] translate-x-1/3 top-16">
        <Briefcase size={200} color="#F2F4F5" />
      </div>

      <SideModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        {isCreator ?
          <ClientJobModal
            jobId={jobId}
            talentId={talent._id}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          /> :
          <TalentJobModal
            jobId={jobId}
            talentId={talent._id}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          />
        }
      </SideModal>
    </div>
  );
};




// Issue Resolution coming soon
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
