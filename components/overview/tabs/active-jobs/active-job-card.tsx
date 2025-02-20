"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import Link from "next/link";
import { Button } from "pakt-ui";
import { Briefcase } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { SideModal } from "@/components/common/side-modal";
import { AfroProfile } from "@/components/common/afro-profile";
import { useHeaderScroll } from "@/lib/store";
import { titleCase } from "@/lib/utils";

import { MobileSheetWrapper } from "@/components/common/mobile-sheet-wrapper";

import { TalentJobSheetForMobile } from "@/components/jobs/mobile-view/sheets/talent";
import { ClientJobModalForMobile } from "@/components/jobs/mobile-view/sheets/client";

import { TalentJobModal } from "@/components/jobs/desktop-view/sheets/talent";
import { ClientJobModal } from "@/components/jobs/desktop-view/sheets/client";

interface ActiveJobCardProps {
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
    // bookmarked?: boolean;
    // bookmarkId?: string;
    // jobId?: string;
    creator: {
        _id: string;
        name: string;
        avatar: string;
        score: number;
        title: string;
    };
    isCreator: boolean;
    progress: {
        total: number;
        progress: number;
    };
    jobProgress: number;
}

export const ActiveJobCard = ({
    id,
    talent,
    creator,
    title,
    description,
    progress,
    isCreator,
    // bookmarkId,
    // jobId,
    // bookmarked,
    jobProgress,
}: ActiveJobCardProps): ReactElement => {
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const { setScrollPosition } = useHeaderScroll();
    const { _id: loggedInUser } = useUserState();

    const profileAccount = creator?._id === loggedInUser ? talent : creator;

    const tab = useMediaQuery("(min-width: 640px)");

    return tab ? (
        <div className="relative z-10 flex w-full gap-4  overflow-hidden rounded-2xl border border-[#9BDCFD] bg-[#F1FBFF] px-4 pl-2">
            <AfroProfile
                src={profileAccount.avatar}
                score={profileAccount.score}
                size="lg"
                url={`/talents/${profileAccount._id}`}
            />
            <div className="flex w-full flex-col gap-4 py-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-title">{title}</h3>
                </div>
                <p className="text-body">{description.slice(0, 250)}</p>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex w-full items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                size="xs"
                                variant="secondary"
                                onClick={() => {
                                    setIsUpdateModalOpen(true);
                                }}
                            >
                                {isCreator && jobProgress < 100
                                    ? "View Updates"
                                    : isCreator && jobProgress === 100
                                      ? "Review"
                                      : !isCreator && jobProgress === 100
                                        ? "Review"
                                        : "Update"}
                            </Button>
                            <Link
                                href={`/messages?userId=${isCreator ? talent._id : creator._id}`}
                            >
                                <Button size="xs" variant="outline">
                                    Message
                                </Button>
                            </Link>
                        </div>
                        <DeliverableProgressBar
                            percentageProgress={progress.progress}
                            totalDeliverables={progress.total}
                            className="w-full max-w-[300px]"
                        />
                    </div>
                </div>
            </div>

            <div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
                <Briefcase size={200} color="#F2F4F5" />
            </div>
            <SideModal
                isOpen={isUpdateModalOpen}
                onOpenChange={(e) => {
                    setIsUpdateModalOpen(e);
                }}
                className="flex flex-col"
            >
                {!isCreator ? (
                    <TalentJobModal
                        jobId={id}
                        talentId={creator._id}
                        closeModal={() => {
                            setIsUpdateModalOpen(false);
                        }}
                    />
                ) : (
                    <ClientJobModal
                        jobId={id}
                        talentId={talent._id}
                        closeModal={() => {
                            setIsUpdateModalOpen(false);
                        }}
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
            // Doesn't work
            onKeyDown={() => {
                setScrollPosition(1);
                setIsMobileModalOpen(true);
            }}
            className="z-10 flex w-full cursor-pointer flex-col gap-4 overflow-hidden border-b border-[#9BDCFD] bg-[#F1FBFF] px-[21px] py-4"
        >
            <div className="relative -left-[5px] flex items-center gap-2">
                <AfroProfile
                    src={profileAccount.avatar}
                    score={profileAccount.score}
                    size="sm"
                    url={`/talents/${profileAccount._id}`}
                />
                <div className="inline-flex flex-col items-start justify-start">
                    <p className="flex text-lg leading-[27px] tracking-wide text-gray-800">
                        {profileAccount.name}
                    </p>
                    <span className="text-xs leading-[18px] tracking-wide text-gray-500">
                        {titleCase(profileAccount.title)}
                    </span>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <h3 className="text-xl font-bold text-title">{title}</h3>
                <p className="flex flex-row gap-4 text-base capitalize text-body">
                    {description.slice(0, 250)}
                </p>
                <div className="flex">
                    <DeliverableProgressBar
                        percentageProgress={progress.progress}
                        totalDeliverables={progress.total}
                        className="w-full max-w-[300px]"
                    />
                </div>
            </div>
            {/* Sidebar Sheet */}
            <MobileSheetWrapper isOpen={isMobileModalOpen}>
                {!isCreator ? (
                    <TalentJobSheetForMobile
                        jobId={id}
                        talentId={creator._id}
                        closeModal={() => {
                            setIsMobileModalOpen(false);
                        }}
                    />
                ) : (
                    <ClientJobModalForMobile
                        jobId={id}
                        talentId={talent._id}
                        closeModal={() => {
                            setIsMobileModalOpen(false);
                        }}
                    />
                )}
            </MobileSheetWrapper>
        </div>
    );
};
