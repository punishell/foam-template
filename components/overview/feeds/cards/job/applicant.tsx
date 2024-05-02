"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "pakt-ui";
import { X } from "lucide-react";
import Link from "next/link";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";
import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { JobFeedWrapper } from "./wrapper";
import { titleCase } from "@/lib/utils";

interface JobApplicationCardProps {
    id: string;
    title: string;
    applicant: {
        _id: string;
        name: string;
        avatar: string;
        score: number;
        title: string;
    };
    bookmarked: boolean;
    bookmarkId: string;
    jobId: string;
    close?: (id: string) => void;
}

export const JobApplicationCard = (
    props: JobApplicationCardProps
): ReactElement => {
    const { id, title, jobId, bookmarked, bookmarkId, applicant, close } =
        props;
    const tab = useMediaQuery("(min-width: 640px)");
    return tab ? (
        <JobFeedWrapper>
            <AfroProfile
                src={applicant.avatar}
                score={applicant.score}
                size="lg"
                url={`/talents/${applicant._id}`}
            />
            <div className="flex w-full flex-col gap-4 py-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-title">
                        New Job Application
                    </h3>
                    {close && (
                        <X
                            size={20}
                            className="cursor-pointer"
                            onClick={() => {
                                close(id);
                            }}
                        />
                    )}
                </div>

                <p className="text-body">
                    You Have Received a new job application for{" "}
                    <span className="text-bold text-title">
                        &quot;{title}&quot;
                    </span>{" "}
                    from {applicant.name}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <Link href={`/jobs/${jobId}/applicants`}>
                        <Button size="xs" variant="secondary">
                            View Applicants
                        </Button>
                    </Link>
                    <RenderBookMark
                        size={20}
                        isBookmarked={bookmarked}
                        type="feed"
                        id={id}
                        bookmarkId={bookmarkId}
                    />
                </div>
            </div>
        </JobFeedWrapper>
    ) : (
        <Link
            href={`/jobs/${jobId}/applicants`}
            className="relative z-10 flex w-full flex-col gap-4 overflow-hidden border-b border-blue-lighter bg-[#F1FBFF] px-[21px] py-4 sm:hidden"
        >
            <div className="relative -left-[5px] flex items-center gap-2">
                <AfroProfile
                    score={applicant.score}
                    src={applicant.avatar}
                    size="sm"
                    url={`/talents/${applicant._id}`}
                />
                <div className="inline-flex flex-col items-start justify-start">
                    <p className="flex text-lg leading-[27px] tracking-wide text-gray-800">
                        {applicant.name}
                    </p>
                    <span className="text-xs leading-[18px] tracking-wide text-gray-500">
                        {titleCase(applicant.title)}
                    </span>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-body">
                        New Job Application
                    </h3>
                </div>
                <div className="flex w-full items-center justify-between gap-2">
                    <p className="w-[80%] text-lg font-normal text-black">
                        You Have Received a new job application for{" "}
                        <span className="text-bold text-title">
                            &quot;{title}&quot;
                        </span>{" "}
                        from {applicant.name}
                    </p>
                    <RenderBookMark
                        size={20}
                        isBookmarked={bookmarked}
                        type="feed"
                        id={id}
                        bookmarkId={bookmarkId}
                    />
                </div>
            </div>
        </Link>
    );
};
