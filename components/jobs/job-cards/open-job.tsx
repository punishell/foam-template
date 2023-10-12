'use client';
import React from 'react';
import Link from 'next/link';
import { Bookmark, X } from 'lucide-react';
import { AfroProfile } from '@/components/common/afro-profile';
import { RenderBookMark } from './render-bookmark';

interface OpenJobProps {
  id: string;
  title: string;
  price: number;
  creator: {
    _id: string;
    name: string;
    avatar?: string;
    paktScore: number;
  };
  skills: {
    type: 'tags';
    name: string;
    color: string;
  }[];
  isBookmarked?: boolean;
  bookmarkId: string;
  onRefresh?: () => void;
}

export const OpenJobCard: React.FC<OpenJobProps> = ({
  creator,
  price,
  skills,
  title,
  id,
  isBookmarked,
  bookmarkId,
  onRefresh,
}) => {
  return (
    <div className="gap-4 bg-white rounded-3xl border-line w-full flex flex-col grow border p-4">
      <Link href={`/jobs/${id}`} className="w-full flex gap-4">
        <AfroProfile src={creator.avatar} score={creator.paktScore} size="md" url={`talents/${creator._id}`} />

        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-body text-lg font-medium">{creator.name}</span>
              <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
            </div>
          </div>
          <div className="flex grow text-title text-2xl">{title}</div>
        </div>
      </Link>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="flex items-center gap-2">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill.name}
              className={`px-4 capitalize rounded-full py-0.5 bg-slate-100`}
              style={{ background: skill.color }}
            >
              {skill.name}
            </span>
          ))}
        </div>
        <RenderBookMark
          id={id}
          size={20}
          type="collection"
          isBookmarked={isBookmarked}
          bookmarkId={bookmarkId}
          callback={onRefresh}
        />
      </div>
    </div>
  );
};
