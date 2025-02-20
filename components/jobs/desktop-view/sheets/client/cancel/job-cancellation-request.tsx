"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, type FC } from "react";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type { Job } from "@/lib/types";
import { isJobCancellation, isJobDeliverable } from "@/lib/types";
import { JobUpdateHeader } from "../../talent/update/header";
import { DeliverablesStepper } from "@/components/jobs/misc/deliverables-stepper";
import { AcceptJobCancellation } from "./accept-job-cancellation";

interface JobCancellationRequestProps {
    job: Job;
    // eslint-disable-next-line react/no-unused-prop-types
    closeModal: () => void;
}

export const JobCancellationRequest: FC<JobCancellationRequestProps> = ({
    job,
}) => {
    const [acceptCancellation, setAcceptCancellation] = useState(false);

    const {
        creator,
        createdAt,
        paymentFee,
        deliveryDate,
        name: jobTitle,
        _id: jobId,
        progress,
        owner,
        tags,
        collections,
    } = job;

    const deliverables = collections.filter(isJobDeliverable);
    const jobCancellation = job.collections.find(isJobCancellation);

    if (!owner) return null;

    if (acceptCancellation) {
        return (
            <AcceptJobCancellation
                job={job}
                talent={owner}
                setAcceptCancellation={setAcceptCancellation}
            />
        );
    }

    return (
        <>
            <div className="flex items-center justify-between bg-gradient-to-r from-danger via-red-500 to-red-400 px-4 py-6 text-3xl font-bold text-white">
                <div className="flex items-center gap-2">
                    <span>{jobTitle}</span>
                </div>
            </div>
            <div className="flex h-full grow flex-col gap-6 px-4 py-6 pb-6">
                <JobUpdateHeader
                    status="cancel_requested"
                    createdAt={createdAt}
                    profile={owner}
                    deliveryDate={deliveryDate}
                    paymentFee={paymentFee}
                    tags={tags}
                />

                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">Explanation</h3>
                    <div className="flex flex-col gap-2 rounded-xl border border-yellow bg-[#FEF4E3] p-3">
                        <h3 className="font-bold">{jobCancellation?.name}</h3>
                        <p>{jobCancellation?.description}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">Deliverables</h3>
                    <DeliverablesStepper
                        jobId={jobId}
                        jobProgress={progress}
                        talentId={owner?._id}
                        jobCreator={creator._id}
                        readonly
                        showActionButton={false}
                        deliverables={deliverables.map(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ({ _id, name, progress, updatedAt }) => ({
                                progress,
                                updatedAt,
                                jobId,
                                description: name,
                                deliverableId: _id,
                                jobCreator: creator._id,
                            })
                        )}
                    />
                </div>
                <div className="pb-6">
                    <div className="mb-6 mt-auto rounded-xl border border-red-300">
                        <Button
                            size="sm"
                            fullWidth
                            onClick={() => {
                                setAcceptCancellation(true);
                            }}
                            variant="danger"
                        >
                            <span className="normal-case">
                                Cancel Job and Review
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
