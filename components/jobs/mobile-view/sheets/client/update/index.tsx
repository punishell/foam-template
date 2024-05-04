"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isJobDeliverable, type Job } from "@/lib/types";
import { DeliverablesStepper } from "@/components/jobs/misc/deliverables-stepper";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/common/popover";
import { JobUpdateHeader } from "./header";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface JobUpdatesProps {
    job: Job;
    requestJobCancellation: () => void;
    closeModal: () => void;
}

export const JobUpdates: FC<JobUpdatesProps> = ({
    job,
    requestJobCancellation,
    closeModal,
}) => {
    const {
        name,
        tags,
        creator,
        owner,
        description,
        createdAt,
        deliveryDate,
        paymentFee,
        collections,
        progress,
        _id: jobId,
    } = job;
    const deliverables = collections.filter(isJobDeliverable);
    const [showDescription, setShowDescription] = useState(false);

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        label: "Jobs",
                        action: () => {
                            closeModal();
                        },
                    },
                    { label: "Job Updates", active: true },
                ]}
            />
            <div className="flex items-start justify-between bg-primary-gradient px-4 py-6 text-3xl font-bold text-white">
                <h3 className="max-w-[90%] break-words text-lg">{name}</h3>
                <Popover>
                    <PopoverTrigger asChild>
                        <button type="button" aria-label="More">
                            <MoreVertical className="h-6 w-6" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="-mt-6 mr-12 flex w-auto flex-col overflow-hidden border-red-100 bg-[#FFFFFF] p-0 text-red-500">
                        <button
                            className="px-4 py-2 text-left duration-200 hover:bg-red-100"
                            onClick={requestJobCancellation}
                            type="button"
                        >
                            Cancel Job
                        </button>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex h-auto flex-col pb-[75px]">
                <JobUpdateHeader
                    createdAt={createdAt}
                    profile={owner ?? creator}
                    deliveryDate={deliveryDate}
                    paymentFee={paymentFee}
                    tags={tags}
                />
                <div
                    className={`relative flex w-full flex-col gap-2.5 overflow-hidden border-b bg-blue-50 p-4 transition-all duration-300 ${showDescription ? "h-[237px]" : "h-[56px]"}`}
                >
                    <button
                        className="flex w-full items-center justify-between"
                        type="button"
                        onClick={() => {
                            setShowDescription(!showDescription);
                        }}
                    >
                        <h3 className="text-lg font-bold">Job Description</h3>
                        <ChevronDown
                            className={`h-6 w-6 transform duration-300 ${showDescription ? "rotate-[360deg]" : "rotate-[270deg]"}`}
                        />
                    </button>
                    <p className="line-clamp-7 text-base leading-normal tracking-wide">
                        {description}
                    </p>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex flex-col items-start">
                        <h3 className="text-lg font-bold">Job Deliverables</h3>
                        <p className="text-body">
                            Deliverables will check off as the talent completes
                            them.
                        </p>
                    </div>

                    <div className="h-full">
                        <DeliverablesStepper
                            jobProgress={progress}
                            jobId={jobId}
                            jobCreator={creator._id}
                            talentId={String(owner?._id)}
                            readonly
                            deliverables={deliverables.map(
                                // eslint-disable-next-line @typescript-eslint/no-shadow
                                ({ _id, name, progress, updatedAt, meta }) => ({
                                    progress,
                                    updatedAt,
                                    meta,
                                    jobId,
                                    description: name,
                                    deliverableId: _id,
                                    jobCreator: creator._id,
                                })
                            )}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
