"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { Button } from "pakt-ui";
import { X, Briefcase } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { AfroProfile } from "@/components/common/afro-profile";
import { SideModal } from "@/components/common/side-modal";
import { CheckBox } from "@/components/common/checkBox";
import { MobileSheetWrapper } from "@/components/common/mobile-sheet-wrapper";
import { useHeaderScroll } from "@/lib/store";
import { titleCase } from "@/lib/utils";

import { ClientJobModal } from "@/components/jobs/desktop-view/sheets/client";
import { TalentJobModal } from "@/components/jobs/desktop-view/sheets/talent";

import { ClientJobModalForMobile } from "@/components/jobs/mobile-view/sheets/client";
import { TalentJobSheetForMobile } from "@/components/jobs/mobile-view/sheets/talent";

interface TalentJobUpdateProps {
    id: string;
    title: string;
    description: string;
    talent: {
        _id: string;
        name: string;
        avatar: string;
        score: number;
        title: string;
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

const MAX_LEN = 150;

export const JobUpdateFeed = ({
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
}: TalentJobUpdateProps): ReactElement => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const { setScrollPosition } = useHeaderScroll();

    const tab = useMediaQuery("(min-width: 640px)");

    return tab ? (
        <div className="relative z-10 hidden w-full gap-4 overflow-hidden  rounded-2xl border border-[#9BDCFD] bg-[#F1FBFF] px-4 pl-2 sm:flex">
            <AfroProfile
                src={talent.avatar}
                score={talent.score}
                size="lg"
                url={`/talents/${talent._id}`}
            />
            <div className="flex w-full flex-col gap-4 py-4">
                <div className="flex justify-between">
                    <h3 className="w-[90%] items-center text-xl text-title">
                        {!isCreator
                            ? title
                            : `${talent.name} ${isMarked ? "completed" : "Unchecked"} a deliverable on `}{" "}
                        <span className="font-bold">{jobTitle}</span>
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
                <p className="flex flex-row gap-4 capitalize text-body">
                    {" "}
                    <CheckBox isChecked={isMarked} />{" "}
                    {description.length > MAX_LEN
                        ? `${description.slice(0, MAX_LEN)}...`
                        : description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex w-full items-center gap-2">
                        <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                        >
                            See Update
                        </Button>

                        <Link
                            href={`/messages?userId=${isCreator ? talent._id : creator._id}`}
                        >
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
                    <RenderBookMark
                        size={20}
                        isBookmarked={bookmarked}
                        type="feed"
                        id={id}
                        bookmarkId={bookmarkId}
                    />
                </div>
            </div>

            <div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
                <Briefcase size={200} color="#F2F4F5" />
            </div>

            <SideModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                {isCreator ? (
                    <ClientJobModal
                        jobId={jobId}
                        talentId={talent._id}
                        closeModal={() => {
                            setIsModalOpen(false);
                        }}
                        extras={id}
                    />
                ) : (
                    <TalentJobModal
                        jobId={jobId}
                        talentId={talent._id}
                        closeModal={() => {
                            setIsModalOpen(false);
                        }}
                        extras={id}
                    />
                )}
            </SideModal>
        </div>
    ) : (
        <div
            role="button"
            tabIndex={0}
            onClick={() => {
                setScrollPosition(1);
                setIsMobileModalOpen(true);
            }}
            onKeyDown={() => {
                setIsMobileModalOpen(true);
            }}
            className="z-10 flex w-full cursor-pointer flex-col gap-4 overflow-hidden border-b border-[#9BDCFD] bg-[#F1FBFF] px-[21px] py-4 sm:hidden"
        >
            <div className="relative -left-[5px] flex items-center gap-2">
                <AfroProfile
                    score={talent.score}
                    src={talent.avatar}
                    size="sm"
                    url={`/talents/${talent._id}`}
                />
                <div className="inline-flex flex-col items-start justify-start">
                    <p className="flex text-lg leading-[27px] tracking-wide text-gray-800">
                        {talent.name}
                    </p>
                    <span className="text-xs leading-[18px] tracking-wide text-gray-500">
                        {titleCase(talent.title)}
                    </span>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <h3 className="w-[90%] items-center text-base text-title">
                    {!isCreator
                        ? title
                        : `${talent.name} ${isMarked ? "completed" : "Unchecked"} a deliverable on `}{" "}
                    <span className="font-bold">{jobTitle}</span>
                </h3>
                <p className="flex flex-row gap-4 text-base capitalize text-body">
                    {description.length > MAX_LEN
                        ? `${description.slice(0, MAX_LEN)}...`
                        : `✅ ${description}`}
                </p>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex w-[80%]">
                        <DeliverableProgressBar
                            percentageProgress={progress.progress}
                            totalDeliverables={progress.total}
                            className="w-full max-w-[300px]"
                        />
                    </div>
                    <RenderBookMark
                        size={20}
                        isBookmarked={bookmarked}
                        type="feed"
                        id={id}
                        bookmarkId={bookmarkId}
                    />
                </div>
            </div>
            {/* Sidebar Sheet */}
            <MobileSheetWrapper isOpen={isMobileModalOpen}>
                {isCreator ? (
                    <ClientJobModalForMobile
                        jobId={jobId}
                        talentId={talent._id}
                        closeModal={() => {
                            setScrollPosition(0);
                            setIsMobileModalOpen(false);
                        }}
                        extras={id}
                    />
                ) : (
                    <TalentJobSheetForMobile
                        jobId={jobId}
                        talentId={talent._id}
                        closeModal={() => {
                            setScrollPosition(0);
                            setIsMobileModalOpen(false);
                        }}
                        extras={id}
                    />
                )}
            </MobileSheetWrapper>
        </div>
    );
};
