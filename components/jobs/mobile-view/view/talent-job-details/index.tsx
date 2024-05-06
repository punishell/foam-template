"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isJobDeliverable, isJobApplicant } from "@/lib/types";
import type { Job } from "@/lib/types";
import { JobHeader } from "../misc/header";
import { JobDeliverables } from "../misc/deliverables";
import { JobSkills } from "../misc/skills";
import { JobDescription } from "../misc/description";
import { CTAS } from "./footer";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface TalentJobDetailsProps {
    job: Job;
    userId: string;
}

export const MobileTalentJobDetails: FC<TalentJobDetailsProps> = ({
    job,
    userId,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const inviteId = job?.invite?._id ?? searchParams.get("invite-id");
    const JOB_TYPE: "private" | "open" = job.isPrivate ? "private" : "open";

    const jobApplicants = job.collections.filter(isJobApplicant);

    const hasAlreadyApplied = jobApplicants.some(
        (applicant) => applicant.creator._id === userId
    );
    const hasBeenInvited = Boolean(
        String(job?.invite?.receiver._id) === String(userId)
    );

    const jobIsAssignedToAnotherTalent =
        job?.owner != null && job?.owner._id !== userId;

    const JobCtas = CTAS[JOB_TYPE];

    return (
        <div className="scrollbar-hide flex h-full w-full grow flex-col overflow-y-auto">
            <Breadcrumb
                items={[
                    {
                        label: "Jobs",
                        action: () => {
                            router.push("/jobs?skills=&search=&range=%2C100");
                        },
                    },
                    { label: "Job Details", active: true },
                ]}
            />
            <JobHeader
                title={job.name}
                price={job.paymentFee}
                dueDate={job.deliveryDate}
                creator={{
                    _id: job?.creator?._id ?? "",
                    score: job?.creator?.score ?? 0,
                    avatar: job?.creator?.profileImage?.url,
                    name: `${job?.creator?.firstName} ${job?.creator?.lastName.slice(0, 1)}.`,
                }}
            />

            <div className="flex h-auto w-full grow flex-col bg-white pb-5">
                <JobDescription description={job.description} />
                <JobSkills skills={job.tags ?? []} />
                <JobDeliverables
                    deliverables={job.collections
                        .filter(isJobDeliverable)
                        .map((collection) => collection.name)}
                />
                <div className="mt-auto flex w-full flex-col items-center px-5">
                    {hasAlreadyApplied && (
                        <div className="my-3 flex w-full items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 p-4 text-blue-500">
                            <Info size={20} />
                            <span className="text-center text-body">
                                You have applied to this job
                            </span>
                        </div>
                    )}

                    {!job.inviteAccepted && !jobIsAssignedToAnotherTalent && (
                        <JobCtas
                            jobId={job._id}
                            inviteId={inviteId}
                            hasBeenInvited={hasBeenInvited}
                            hasAlreadyApplied={hasAlreadyApplied}
                            jobCreator={job.creator._id}
                        />
                    )}

                    {job.inviteAccepted && !jobIsAssignedToAnotherTalent && (
                        <div className="my-3 flex w-full items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-green-500">
                            <Info size={20} />
                            <span className="text-center text-green-500">
                                You have already accepted this Job invite.
                            </span>
                        </div>
                    )}

                    {jobIsAssignedToAnotherTalent && (
                        <div className="my-3 flex w-full items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-red-500">
                            <Info size={20} />
                            <span className="text-center text-red-500">
                                This job is already assigned to another talent.
                                You can apply to other jobs.
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
