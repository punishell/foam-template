'use client';
import React from 'react';
import { Button } from 'pakt-ui';
import { useRouter } from 'next/navigation';
import { SideModal } from '@/components/common/side-modal';
import { UserAvatar } from '@/components/common/user-avatar';
import { DeliverableProgressBar } from '@/components/common/deliverable-progress-bar';

interface AssignedJobCardProps {
  title: string;
  price: number;
  inviter: {
    name: string;
    avatar: string;
    paktScore: number;
  };
}

export const AssignedJobClientView: React.FC<AssignedJobCardProps> = ({ inviter, price, title }) => {
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="gap-4 max-w-2xl bg-white rounded-3xl border-line w-full flex flex-col grow border p-4">
      <div className="w-full flex gap-4">
        {<UserAvatar score={inviter.paktScore} size="sm" />}
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            {<span className="text-body text-lg font-bold">{inviter.name}</span>}

            <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
          </div>
          <div className="grow text-title text-2xl">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="gap-2 flex items-center">
          <Button size="xs" variant="secondary" onClick={() => setShowModal(true)}>
            See Updates
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              router.push('/messages/123');
            }}
          >
            Message
          </Button>
        </div>

        <SideModal isOpen={showModal} onOpenChange={() => setShowModal(false)} className="flex flex-col">
          <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-3xl">
            Email Newsletter Design for a Monthly Newsletter
          </div>
          <div className="flex py-6 px-4 flex-col gap-6">
            <div className="flex flex-col gap-4">
              <table className="table-auto">
                <colgroup>
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '75%' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Date Created</th>
                    <td className=" px-4 py-2">23 June, 2023</td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Due Date</th>
                    <td className=" px-4 py-2">23 June, 2023</td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Price</th>
                    <td className=" px-4 py-2">5000 USD</td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Status</th>
                    <td className=" px-4 py-2">
                      <span className="px-3 text-sm text-title inline-flex rounded-full bg-[#B2E9AA66]">
                        In Progress
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Client</th>
                    <td className=" px-4 py-2">
                      <div className="flex gap-2 items-center">
                        <UserAvatar score={40} size="xs" />
                        <div className="flex flex-col">
                          <span className="text-title text-base font-bold">{inviter.name}</span>
                          <span className="text-sm ">Inviter</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Skills</th>
                    <td className=" px-4 py-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-4 capitalize rounded-full py-0.5 bg-slate-100">Logo Design</span>
                        <span className="px-4 capitalize rounded-full py-0.5 bg-slate-100">Graphic Design</span>
                        <span className="px-4 capitalize rounded-full py-0.5 bg-slate-100">Illustration</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">Job Description</h3>
              <div className="rounded-2x bg-[#FFEFD7] p-4 rounded-2xl">
                Are you a naturally goofy person who loves making people laugh? Do you have a wild imagination and a
                passion for creating hilarious product designs? If so, we have the perfect short-term contract position
                for you as our Chief Goofiness Officer!
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="font-bold text-lg">Job Deliverables</h3>
                <p className="">Mark the deliverables as you&rsquo;re done with them</p>
              </div>

              <div>
                <JobMilestone
                  milestone="Initial design concepts for the email newsletter to provide a clear understanding of how the final design will look like."
                  isCompleted={true}
                />
                <JobMilestone
                  milestone="Initial design concepts for the email newsletter to provide a clear understanding of how the final design will look like."
                  isCompleted={false}
                />
                <JobMilestone
                  milestone="Initial design concepts for the email newsletter to provide a clear understanding of how the final design will look like."
                  isCompleted={false}
                  isLastMilestone={true}
                />
              </div>
            </div>
          </div>
        </SideModal>

        {<DeliverableProgressBar completedDeliverables={2} totalDeliverables={5} />}
      </div>
    </div>
  );
};

export const AssignedJobTalentView: React.FC<AssignedJobCardProps> = ({ inviter, price, title }) => {
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="gap-4 max-w-2xl bg-white rounded-3xl border-line w-full flex flex-col grow border p-4">
      <div className="w-full flex gap-4">
        {<UserAvatar score={inviter.paktScore} size="sm" />}
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            {<span className="text-body text-lg font-bold">{inviter.name}</span>}

            <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
          </div>
          <div className="grow text-title text-2xl">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="gap-2 flex items-center">
          <Button size="xs" variant="secondary" onClick={() => setShowModal(true)}>
            Update
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              router.push('/messages/123');
            }}
          >
            Message
          </Button>
        </div>

        <SideModal isOpen={showModal} onOpenChange={() => setShowModal(false)} className="flex flex-col">
          <div className="py-6 px-4 bg-primary-gradient text-white font-bold text-3xl">
            Email Newsletter Design for a Monthly Newsletter
          </div>
          <div className="flex py-6 px-4 flex-col gap-6">
            <div className="flex flex-col gap-4">
              <table className="table-auto">
                <colgroup>
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '75%' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Date Created</th>
                    <td className=" px-4 py-2">23 June, 2023</td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Due Date</th>
                    <td className=" px-4 py-2">23 June, 2023</td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Price</th>
                    <td className=" px-4 py-2">5000 USD</td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Status</th>
                    <td className=" px-4 py-2">
                      <span className="px-3 text-sm text-title inline-flex rounded-full bg-[#B2E9AA66]">
                        In Progress
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Client</th>
                    <td className=" px-4 py-2">
                      <div className="flex gap-2 items-center">
                        <UserAvatar score={40} size="xs" />
                        <div className="flex flex-col">
                          <span className="text-title text-base font-bold">{inviter.name}</span>
                          <span className="text-sm ">Inviter</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2 text-left font-normal text-body">Skills</th>
                    <td className=" px-4 py-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-4 capitalize rounded-full py-0.5 bg-slate-100">Logo Design</span>
                        <span className="px-4 capitalize rounded-full py-0.5 bg-slate-100">Graphic Design</span>
                        <span className="px-4 capitalize rounded-full py-0.5 bg-slate-100">Illustration</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">Job Description</h3>
              <div className="rounded-2x bg-[#FFEFD7] p-4 rounded-2xl">
                Are you a naturally goofy person who loves making people laugh? Do you have a wild imagination and a
                passion for creating hilarious product designs? If so, we have the perfect short-term contract position
                for you as our Chief Goofiness Officer!
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="font-bold text-lg">Job Deliverables</h3>
                <p className="">Mark the deliverables as you&rsquo;re done with them</p>
              </div>

              <div>
                <JobMilestone
                  milestone="Initial design concepts for the email newsletter to provide a clear understanding of how the final design will look like."
                  isCompleted={true}
                />
                <JobMilestone
                  milestone="Initial design concepts for the email newsletter to provide a clear understanding of how the final design will look like."
                  isCompleted={false}
                />
                <JobMilestone
                  milestone="Initial design concepts for the email newsletter to provide a clear understanding of how the final design will look like."
                  isCompleted={false}
                  isLastMilestone={true}
                />
              </div>
            </div>
          </div>
        </SideModal>

        {<DeliverableProgressBar completedDeliverables={2} totalDeliverables={5} />}
      </div>
    </div>
  );
};

interface JobMilestoneProps {
  milestone: string;
  isCompleted: boolean;
  isActive?: boolean;
  isLastMilestone?: boolean;
}

const JobMilestone: React.FC<JobMilestoneProps> = ({ milestone, isCompleted, isLastMilestone }) => {
  const [checked, setChecked] = React.useState('indeterminate');

  return (
    <div className="flex gap-5 items-start max-w-lg py-3 relative">
      <div
        className="absolute top-0 left-3 translate-y-3 w-[2px] h-full "
        style={{
          display: isLastMilestone ? 'none' : 'block',
          background: isCompleted ? '#4CD471' : '#E8E8E8',
        }}
      />
      <div className="">
        <SquareCheckMark isChecked={isCompleted} />
      </div>
      <div>{milestone}</div>
    </div>
  );
};

interface SquareCheckMark {
  isChecked: boolean;
  setIsChecked?: () => void;
}

const SquareCheckMark: React.FC<SquareCheckMark> = ({ isChecked, setIsChecked }) => {
  return (
    <button className="isolate" onClick={setIsChecked}>
      {isChecked ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="5" fill="#007C5B" />
          <path d="M8 13L10.9167 16L16 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="1" y="1" width="22" height="22" rx="5" stroke="#4CD571" strokeWidth="2" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="5" fill="url(#paint0_linear_988_53583)" />
          <rect x="1" y="1" width="22" height="22" rx="5" stroke="#DADADA" strokeWidth="2" />
          <defs>
            <linearGradient id="paint0_linear_988_53583" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FCFCFC" />
              <stop offset="1" stopColor="#F8F8F8" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </button>
  );
};
