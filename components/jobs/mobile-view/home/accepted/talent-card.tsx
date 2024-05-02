"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState, useEffect } from "react";
import Rating from "react-rating";
import { Star } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type JobStatus } from "@/lib/types";
import { SideModal } from "@/components/common/side-modal";
import { AfroProfile } from "@/components/common/afro-profile";
import { TalentJobModal } from "@/components/jobs/desktop-view/sheets/talent";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { useErrorService } from "@/lib/store/error-service";
import { titleCase } from "@/lib/utils";

interface TalentJobCardProps {
    jobId: string;
    title: string;
    reviewText?: string;
    ratingCount?: number;
    price: number;
    status?: JobStatus;
    isCompleted?: boolean;
    totalDeliverables: number;
    completedDeliverables: number;
    client: {
        id: string;
        name: string;
        avatar?: string;
        paktScore: number;
        title: string;
    };
}

export const TalentJobCard: FC<TalentJobCardProps> = ({
    client,
    price,
    title,
    jobId,
    status,
    isCompleted,
    totalDeliverables,
    completedDeliverables,
    reviewText,
    ratingCount,
}) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const progress = Math.floor(
        (completedDeliverables / totalDeliverables) * 100
    );
    const { setErrorMessage } = useErrorService();

    useEffect(() => {
        setErrorMessage({
            title: "This is a temporary useEffect",
            message: status,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className={`flex w-full flex-col gap-1 border-b p-4 pt-0 ${status === "cancelled" ? "border-[#FF5247] bg-[#FFF4F4]" : "border-line bg-white"}`}
            onMouseDown={() => {
                setIsUpdateModalOpen(true);
            }}
            role="button"
            tabIndex={0}
        >
            <div className="flex w-full gap-4">
                <div className="-ml-3">
                    <AfroProfile
                        score={client.paktScore}
                        size="2sm"
                        src={client.avatar}
                    />
                </div>
                <div className="flex w-full items-center justify-between gap-2">
                    <div className="-ml-3 flex flex-col">
                        <span className="text-lg leading-[27px] tracking-wide text-gray-800">
                            {client.name}
                        </span>
                        <span className="text-xs leading-[18px] tracking-wide text-gray-500">
                            {titleCase(client.title)}
                        </span>
                    </div>
                    <span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base font-bold text-title">
                        ${price}
                    </span>
                </div>
            </div>
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
                    totalDeliverables={totalDeliverables}
                    percentageProgress={progress}
                    className="w-full max-w-none"
                    isCancelled={status === "cancelled"}
                />

                <SideModal
                    isOpen={isUpdateModalOpen}
                    onOpenChange={() => {
                        setIsUpdateModalOpen(false);
                    }}
                    className="flex flex-col"
                >
                    <TalentJobModal
                        talentId={client.id}
                        jobId={jobId}
                        closeModal={() => {
                            setIsUpdateModalOpen(false);
                        }}
                    />
                </SideModal>
            </div>
        </div>
    );
};
