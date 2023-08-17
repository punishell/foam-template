'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from 'pakt-ui';
import { Bookmark, X } from 'lucide-react';
import { UserAvatar } from '@/components/common/user-avatar';
import { DeliverableProgressBar } from '@/components/common/deliverable-progress-bar';

interface AssignedJobProps {
  title: string;
  price: number;
  inviter: {
    name: string;
    avatar: string;
    paktScore: number;
  };
  type: 'assigned';
}

interface UnAssignedJobProps {
  title: string;
  price: number;
  createdAt: string;
  type: 'unassigned';
}

type Props = AssignedJobProps | UnAssignedJobProps;

export const Job: React.FC<Props> = (props) => {
  const { type, price, title } = props;
  return (
    <div className="gap-4 max-w-2xl bg-white rounded-3xl border-line w-full flex flex-col grow border p-4">
      <div className="w-full flex gap-4">
        {type === 'assigned' && <UserAvatar score={props.inviter.paktScore} />}
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            {type === 'unassigned' && <span className="text-body text-lg">{props.createdAt}</span>}
            {type === 'assigned' && <span className="text-body text-lg font-bold">{props.inviter.name}</span>}

            <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
          </div>
          <div className="grow text-title text-2xl">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        {type === 'assigned' && (
          <div className="gap-2 flex items-center">
            <Button size="xs" variant="secondary">
              Update
            </Button>
            <Button size="xs" variant="outline">
              Message
            </Button>
          </div>
        )}

        {type === 'unassigned' && (
          <div className="gap-2 flex items-center">
            <Button size="xs" variant="secondary">
              Find Talent
            </Button>
            <Button size="xs" variant="outline">
              Job Details
            </Button>
          </div>
        )}

        {type === 'assigned' && <DeliverableProgressBar completedDeliverables={2} totalDeliverables={5} />}
      </div>
    </div>
  );
};

interface PublicJobProps {
  title: string;
  price: number;
  creator: {
    name: string;
    avatar: string;
    paktScore: number;
  };
  skills: string[];
}

export const PublicJobCard: React.FC<PublicJobProps> = ({ creator, price, skills, title }) => {
  return (
    <Link
      href="/jobs/12345"
      className="gap-4 max-w-2xl bg-white rounded-3xl border-line w-full flex flex-col grow border p-4"
    >
      <div className="w-full flex gap-4">
        {<UserAvatar score={creator.paktScore} />}

        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-body text-base font-medium">{creator.name}</span>
              <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
            </div>

            <X size={20} />
          </div>
          <div className="grow text-title text-xl">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="flex items-center gap-2">
          {skills.map((skill) => (
            <span key={skill} className="px-4 capitalize rounded-full py-0.5 bg-slate-100">
              {skill}
            </span>
          ))}
        </div>
        <button className="flex items-center gap-2">
          <Bookmark size={20} />
          <span>Bookmark</span>
        </button>
      </div>
    </Link>
  );
};
