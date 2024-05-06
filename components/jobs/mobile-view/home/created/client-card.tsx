"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";
import Rating from "react-rating";
import { Star } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AfroProfile } from "@/components/common/afro-profile";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { titleCase } from "@/lib/utils";
import { MobileSheetWrapper } from "@/components/common/mobile-sheet-wrapper";
import { ClientJobModalForMobile } from "@/components/jobs/mobile-view/sheets/client";

interface ClientJobCardProps {
    jobId: string;
    title: string;
    reviewText?: string;
    ratingCount?: number;
    price: number;
    isCancelled?: boolean;
    totalDeliverables: number;
    completedDeliverables: number;
    talent: {
        id: string;
        name: string;
        avatar?: string;
        paktScore: number;
        title: string;
    };
    isCompleted?: boolean;
}

export const ClientJobCard: FC<ClientJobCardProps> = ({
    talent,
    price,
    title,
    jobId,
    isCancelled,
    totalDeliverables,
    completedDeliverables,
    isCompleted,
    reviewText,
    ratingCount,
    // reviewRequestChange,
    // jobProgress,
}) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const progress = Math.floor(
        (completedDeliverables / totalDeliverables) * 100
    );

    return (
        <div
            className="flex w-full flex-col gap-1 border-b border-gray-200 bg-neutral-50 p-4 pt-0"
            onMouseDown={() => {
                setIsUpdateModalOpen(true);
            }}
            role="button"
            tabIndex={0}
        >
            <div className="flex w-full gap-4">
                <div className="-ml-3">
                    <AfroProfile
                        score={talent.paktScore}
                        size="2sm"
                        src={talent.avatar}
                        url={`/talents/${talent.id}`}
                    />
                </div>
                <div className="flex w-full items-center justify-between gap-2">
                    <div className="-ml-3 flex flex-col">
                        <span className="text-lg leading-[27px] tracking-wide text-gray-800">
                            {talent.name}
                        </span>
                        <span className="text-xs leading-[18px] tracking-wide text-gray-500">
                            {titleCase(talent.title)}
                        </span>
                    </div>
                    <span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base font-bold text-title">
                        ${price}
                    </span>
                </div>
            </div>
            {!isCompleted && (
                <div className="text-base font-medium leading-normal tracking-tight text-gray-500">
                    Completed a Deliverables
                </div>
            )}
            <div className="flex grow items-center break-words text-lg text-gray-800">
                {title}
            </div>
            {isCompleted && (
                <div className="text-base leading-normal tracking-tight text-gray-500">
                    {reviewText}
                </div>
            )}
            <div className="mt-auto flex w-full flex-col items-start gap-2">
                {isCompleted && (
                    /*  @ts-expect-error --- */
                    <Rating
                        readonly
                        initialRating={ratingCount ?? 0}
                        fullSymbol={
                            <Star fill="#15D28E" color="#15D28E" size={18} />
                        }
                        emptySymbol={
                            <Star
                                fill="transparent"
                                color="#15D28E"
                                size={18}
                            />
                        }
                    />
                )}
                <DeliverableProgressBar
                    isCancelled={isCancelled}
                    percentageProgress={progress}
                    totalDeliverables={totalDeliverables}
                    className="w-full max-w-none"
                />

                {/* Sidebar Sheet */}
                <MobileSheetWrapper isOpen={isUpdateModalOpen}>
                    <ClientJobModalForMobile
                        jobId={jobId}
                        talentId={talent.id}
                        closeModal={() => {
                            setIsUpdateModalOpen(false);
                        }}
                    />
                </MobileSheetWrapper>
            </div>
        </div>
    );
};
