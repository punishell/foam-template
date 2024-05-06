"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type ReactElement } from "react";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isJobDeliverable } from "@/lib/types";
import { Spinner } from "@/components/common";
import { useCancelJobInvite } from "@/lib/api/job";
import type { Job } from "@/lib/types";
import { Modal } from "@/components/common/headless-modal";
import { JobHeader } from "../misc/header";
import { JobDeliverables } from "../misc/deliverables";
import { JobSkills } from "../misc/skills";
import { JobDescription } from "../misc/description";
import { DeleteJobModal } from "./modal/delete";
import { CTAS } from "./footer";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface ClientJobDetailsProps {
    job: Job;
}

export function MobileClientJobDetails({
    job,
}: ClientJobDetailsProps): ReactElement {
    const router = useRouter();
    const cancelInvite = useCancelJobInvite();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const JOB_TYPE: "private" | "open" = job.isPrivate ? "private" : "open";

    const JobCtas = CTAS[JOB_TYPE];

    return (
        <>
            <div className="scrollbar-hide flex h-full w-full grow flex-col overflow-y-auto">
                <Breadcrumb
                    items={[
                        {
                            label: "Jobs",
                            action: () => {
                                router.push(
                                    "/jobs?skills=&search=&range=%2C100"
                                );
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
                        _id: job?.owner?._id ?? "",
                        score: job?.owner?.score ?? 0,
                        avatar: job?.owner?.profileImage?.url,
                        name: `${job?.owner?.firstName} ${job?.owner?.lastName.slice(0, 1)}.`,
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
                        {job.invite == null && (
                            <JobCtas
                                jobId={job._id}
                                skills={job.tagsData}
                                openDeleteModal={() => {
                                    setIsDeleteModalOpen(true);
                                }}
                            />
                        )}

                        {job.invite != null && (
                            <div className="mt-auto w-full">
                                <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-blue-300 bg-blue-50 p-4 text-blue-500">
                                    <div className="flex items-center gap-2">
                                        <Info size={20} />
                                        <span>Awaiting Talent Response</span>
                                    </div>

                                    <button
                                        className="flex h-[35px] w-[130px] items-center justify-center rounded-lg border border-red-500 bg-red-50 text-sm text-red-500"
                                        onClick={() => {
                                            cancelInvite.mutate(
                                                {
                                                    inviteId:
                                                        job.invite?._id ?? "",
                                                },
                                                {}
                                            );
                                        }}
                                        type="button"
                                    >
                                        {cancelInvite.isLoading ? (
                                            <Spinner size={16} />
                                        ) : (
                                            "Cancel Invite"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isDeleteModalOpen}
                closeModal={() => {
                    setIsDeleteModalOpen(false);
                }}
            >
                <DeleteJobModal
                    jobId={job._id}
                    title={job.name}
                    setModalOpen={setIsDeleteModalOpen}
                />
            </Modal>
        </>
    );
}
