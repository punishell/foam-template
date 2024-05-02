"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "@/components/common/afro-profile";
import { RenderBookMark } from "../../../../misc/render-bookmark";
import { titleCase } from "@/lib/utils";

interface OpenJobProps {
    id: string;
    title: string;
    price: number;
    creator: {
        _id: string;
        name: string;
        avatar?: string;
        paktScore: number;
        title: string;
    };
    skills: Array<{
        type: "tags";
        name: string;
        color: string;
    }>;
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
        <div className="flex w-full flex-col gap-4 border-b border-green-300 bg-[#FDFFFC] p-4">
            <div className="flex items-center justify-between gap-2">
                <Link
                    href={`/jobs/${id}`}
                    className="relative -left-2 flex w-full items-center gap-2"
                >
                    <AfroProfile
                        src={creator.avatar}
                        score={creator.paktScore}
                        size="2sm"
                        url={`talents/${creator._id}`}
                    />

                    <div className="flex flex-col items-start">
                        <div className="text-lg leading-[27px] tracking-wide text-gray-800">
                            {creator.name}
                        </div>

                        <span className="text-xs leading-[18px] tracking-wide text-gray-500">
                            {titleCase(creator.title)}
                        </span>
                    </div>
                </Link>

                <span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base text-title">
                    ${price}
                </span>
            </div>
            <p className="text-lg leading-[27px] tracking-wide text-gray-800">
                {title}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                    {skills.slice(0, 3).map((skill) => (
                        <span
                            key={skill.name}
                            className="min-w-[50px] whitespace-nowrap rounded-full bg-slate-100 px-4 py-0.5 text-sm capitalize last:!max-w-[106px] last:!truncate 2xl:last:!max-w-[166px]"
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
                    // useCheck
                />
            </div>
        </div>
    );
};
