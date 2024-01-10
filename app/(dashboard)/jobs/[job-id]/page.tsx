"use client";

import React from "react";
import { Button } from "pakt-ui";
import { Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { isJobDeliverable, isJobApplicant } from "@/lib/types";
import { Spinner } from "@/components/common";
import { useApplyToOpenJob, useDeleteJob, useGetJobById, useCancelJobInvite } from "@/lib/api/job";
import { useDeclineInvite, useAcceptInvite } from "@/lib/api/invites";
import type { Job } from "@/lib/types";
import { useGetAccount } from "@/lib/api/account";
import success from "@/lottiefiles/success.json";
import { Modal } from "@/components/common/headless-modal";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { JobHeader, JobDescription, JobSkills, JobDeliverables } from "@/components/jobs/job-details";
import { NumericInput } from "@/components/common/numeric-input";

const jobApplicationSchema = z.object({
    message: z.string().nonempty("Message is required"),
    amount: z.coerce.number().min(100, { message: "Amount must be at least $100" }).nonnegative(),
});

type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

// CLIENT JOB DETAILS

interface ClientPrivateJobCtasProps {
    jobId: string;
    openDeleteModal: () => void;
    skills?: string[];
}

const ClientPrivateJobCtas: React.FC<ClientPrivateJobCtasProps> = ({ jobId, skills = [], openDeleteModal }) => {
    const router = useRouter();

    return (
        <div className="mt-auto flex w-full items-center justify-between gap-4">
            <div className="w-full max-w-[160px] rounded-xl border border-red-400">
                <Button fullWidth variant="danger" onClick={openDeleteModal} size="sm">
                    Delete Job
                </Button>
            </div>

            <div className="flex w-full max-w-sm items-center gap-2">
                <Button
                    fullWidth
                    variant="outline"
                    onClick={() => {
                        router.push(`/jobs/${jobId}/edit`);
                    }}
                >
                    Edit Job
                </Button>
                <Button
                    fullWidth
                    onClick={() => {
                        router.push(
                            `/talents${skills != null && skills?.length > 0 ? `?skills=${skills?.join(",")}` : ""}`,
                        );
                    }}
                >
                    Find Talent
                </Button>
            </div>
        </div>
    );
};

interface ClientOpenJobCtasProps {
    jobId: string;
    openDeleteModal: () => void;
}

const ClientOpenJobCtas: React.FC<ClientOpenJobCtasProps> = ({ jobId, openDeleteModal }) => {
    const router = useRouter();

    return (
        <div className="mt-auto flex w-full items-center justify-between gap-4">
            <div className="w-full max-w-[160px] rounded-xl border border-red-400">
                <Button fullWidth variant="danger" onClick={openDeleteModal}>
                    Delete Job
                </Button>
            </div>

            <div className="flex w-full max-w-sm items-center gap-2">
                <Button
                    fullWidth
                    variant="outline"
                    onClick={() => {
                        router.push(`/jobs/${jobId}/edit`);
                    }}
                >
                    Edit Job
                </Button>
                <Button
                    fullWidth
                    onClick={() => {
                        router.push(`/jobs/${jobId}/applicants`);
                    }}
                >
                    View Applicants
                </Button>
            </div>
        </div>
    );
};

interface ClientDeleteJobModalProps {
    jobId: string;
    title: string;
    setModalOpen: (state: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DeleteJobModal: React.FC<ClientDeleteJobModalProps> = ({ jobId, title, setModalOpen }) => {
    const deleteJobMutation = useDeleteJob();
    const router = useRouter();

    return (
        <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-medium">Delete Job</h2>
                <span className="text-center text-body">
                    This action is irreversible. Once you delete the Job, all of its content and data will be
                    permanently erased.
                </span>
                <span className="font-bold text-body">Are you sure you want to proceed with the deletion?</span>
            </div>
            <div className="mt-auto flex w-full flex-row items-center justify-between gap-2">
                <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => {
                        setModalOpen(false);
                    }}
                >
                    No, Cancel
                </Button>
                <div className="w-full rounded-xl border border-red-400">
                    <Button
                        fullWidth
                        variant="danger"
                        onClick={() => {
                            deleteJobMutation.mutate(
                                { id: jobId },

                                {
                                    onSuccess: () => {
                                        router.push("/jobs");
                                    },
                                },
                            );
                        }}
                        disabled={deleteJobMutation.isLoading}
                    >
                        {deleteJobMutation.isLoading ? <Spinner /> : "Yes, Proceed"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface ClientJobDetailsProps {
    job: Job;
}

function ClientJobDetails({ job }: ClientJobDetailsProps): React.JSX.Element {
    const cancelInvite = useCancelJobInvite();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const JOB_TYPE: "private" | "open" = job.isPrivate ? "private" : "open";

    const CTAS = {
        open: ClientOpenJobCtas,
        private: ClientPrivateJobCtas,
    };

    const JobCtas = CTAS[JOB_TYPE];

    return (
        <div className="flex h-full gap-6">
            <div className="scrollbar-hide flex h-full grow flex-col overflow-y-auto pb-20">
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
                <div className="flex w-full grow flex-col rounded-b-xl border border-t-0 border-line bg-white p-6">
                    <JobSkills skills={job.tags ?? []} />
                    <JobDescription description={job.description} />

                    <JobDeliverables
                        deliverables={job.collections.filter(isJobDeliverable).map((collection) => collection.name)}
                    />

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
                        <div className="my-3 flex w-full items-center justify-between gap-2 rounded-2xl border border-blue-300 bg-blue-50 p-4 text-blue-500">
                            <div className="flex items-center gap-2">
                                <Info size={20} />
                                <span>Awaiting Talent Response</span>
                            </div>

                            <button
                                className="flex h-[35px] w-[130px] items-center justify-center rounded-lg border border-red-500 bg-red-50 text-sm text-red-500"
                                onClick={() => {
                                    cancelInvite.mutate({ inviteId: job.invite?._id ?? "" }, {});
                                }}
                                type="button"
                            >
                                {cancelInvite.isLoading ? <Spinner size={16} /> : "Cancel Invite"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex  h-full w-fit basis-[270px] flex-col items-center gap-7" />
            <Modal
                isOpen={isDeleteModalOpen}
                closeModal={() => {
                    setIsDeleteModalOpen(false);
                }}
            >
                <DeleteJobModal jobId={job._id} title={job.name} setModalOpen={setIsDeleteModalOpen} />
            </Modal>
        </div>
    );
}

// TALENT JOB DETAILS

interface TalentPrivateJobCtasProps {
    inviteId: string | null;
    hasBeenInvited: boolean;
    jobId: string;
    jobCreator: string;
}

const TalentPrivateJobCtas: React.FC<TalentPrivateJobCtasProps> = ({ inviteId, hasBeenInvited, jobId, jobCreator }) => {
    const router = useRouter();
    const acceptInvite = useAcceptInvite({ jobCreator, jobId });
    const declineInvite = useDeclineInvite({ jobCreator, jobId });

    if (inviteId == null || !hasBeenInvited) return null;

    return (
        <div className="mt-auto flex w-full items-center justify-end">
            <div className="flex w-full max-w-sm items-center gap-4">
                <Button
                    fullWidth
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        declineInvite.mutate(
                            { id: inviteId },
                            {
                                onSuccess: () => {
                                    router.push("/overview");
                                },
                            },
                        );
                    }}
                >
                    {declineInvite.isLoading ? <Spinner /> : "Decline"}
                </Button>

                <Button
                    fullWidth
                    size="sm"
                    onClick={() => {
                        acceptInvite.mutate(
                            { id: inviteId },
                            {
                                onSuccess: () => {
                                    router.push("/jobs?jobs-type=accepted");
                                },
                            },
                        );
                    }}
                >
                    {acceptInvite.isLoading ? <Spinner /> : "Accept Invite"}
                </Button>
            </div>
        </div>
    );
};

interface TalentJobApplyModalProps {
    jobId: string;
    jobCreator: string;
}

const TalentJobApplyModal: React.FC<TalentJobApplyModalProps> = ({ jobId, jobCreator }) => {
    const jobQuery = useGetJobById({ jobId });
    const applyToOpenJob = useApplyToOpenJob({ jobCreator, jobId });
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

    const form = useForm<JobApplicationFormValues>({
        resolver: zodResolver(jobApplicationSchema),
        defaultValues: {
            message: "",
        },
    });

    const onSubmit: SubmitHandler<JobApplicationFormValues> = ({ amount, message = "" }) => {
        applyToOpenJob.mutate(
            {
                jobId,
                amount,
                message,
            },
            {
                onSuccess: () => {
                    setShowSuccessMessage(true);
                    void jobQuery.refetch();
                },
            },
        );
    };

    if (showSuccessMessage) {
        return (
            <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
                <div className="flex flex-col items-center gap-1">
                    <div className="-mt-[4] max-w-[200px]">
                        <Lottie animationData={success} loop={false} />
                    </div>

                    <h2 className="text-2xl font-medium">Application Sent</h2>
                    <span className="text-body">You will get a notification if the client sends you a message</span>
                </div>
            </div>
        );
    }
    return (
        <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border bg-white p-6">
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-2xl font-medium">Propose Price</h2>
            </div>

            <form className="flex flex-col items-center gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex w-full flex-col gap-2">
                    <label htmlFor="due" className="text-title">
                        Enter Bid
                    </label>

                    <div className="hover:duration-200h-[45px] flex items-center gap-2 rounded-lg border border-line bg-[#FCFCFD] px-4 py-3 outline-none focus-within:border-secondary hover:border-secondary">
                        {/* <DollarIcon /> */}
                        <span className="text-body ">$</span>
                        <NumericInput
                            type="text"
                            {...form.register("amount")}
                            placeholder="e.g 1000"
                            className="h-full  bg-transparent text-sm text-body focus:outline-none"
                        />
                    </div>

                    {form.formState.errors.amount != null && (
                        <span className="text-sm text-red-500">{form.formState.errors.amount.message}</span>
                    )}
                </div>

                <div className="flex w-full flex-col gap-2">
                    <label htmlFor="due" className="text-title">
                        Message
                    </label>
                    <textarea
                        rows={3}
                        maxLength={150}
                        id="due"
                        {...form.register("message")}
                        placeholder="Describe why you're a good candidate"
                        className="w-full resize-none rounded-lg border border-line bg-[#FCFCFD] px-4 py-3 outline-none focus-within:border-secondary hover:border-secondary hover:duration-200"
                    />
                    <div className="-mt-1 ml-auto w-fit text-sm text-body">
                        {form.watch("message")?.length} / 150 characters
                    </div>

                    {form.formState.errors.message != null && (
                        <span className="text-sm text-red-500">{form.formState.errors.message.message}</span>
                    )}
                </div>

                <Button fullWidth>{applyToOpenJob.isLoading ? <Spinner /> : "Send Application"}</Button>
            </form>
        </div>
    );
};

interface TalentOpenJobCtasProps {
    jobId: string;
    jobCreator: string;
    inviteId: string | null;
    hasAlreadyApplied: boolean;
    hasBeenInvited: boolean;
}

const TalentOpenJobCtas: React.FC<TalentOpenJobCtasProps> = ({
    jobId,
    jobCreator,
    hasBeenInvited,
    inviteId,
    hasAlreadyApplied,
}) => {
    const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
    if (hasBeenInvited)
        return (
            <TalentPrivateJobCtas
                inviteId={inviteId}
                hasBeenInvited={hasBeenInvited}
                jobId={jobId}
                jobCreator={jobCreator}
            />
        );

    return (
        <div className="ml-auto w-full max-w-[200px]">
            {!hasAlreadyApplied && (
                <Button
                    fullWidth
                    onClick={() => {
                        setIsApplyModalOpen(true);
                    }}
                >
                    Apply
                </Button>
            )}

            <Modal
                isOpen={isApplyModalOpen}
                closeModal={() => {
                    setIsApplyModalOpen(false);
                }}
            >
                <TalentJobApplyModal jobId={jobId} jobCreator={jobCreator} />
            </Modal>
        </div>
    );
};

interface TalentJobDetailsProps {
    job: Job;
    userId: string;
}
const TalentJobDetails: React.FC<TalentJobDetailsProps> = ({ job, userId }) => {
    const searchParams = useSearchParams();
    const inviteId = job?.invite?._id ?? searchParams.get("invite-id");
    const JOB_TYPE: "private" | "open" = job.isPrivate ? "private" : "open";

    const jobApplicants = job.collections.filter(isJobApplicant);

    const hasAlreadyApplied = jobApplicants.some((applicant) => applicant.creator._id === userId);
    const hasBeenInvited = Boolean(String(job?.invite?.receiver._id) === String(userId));
    const CTAS = {
        open: TalentOpenJobCtas,
        private: TalentPrivateJobCtas,
    };

    const jobIsAssignedToAnotherTalent = job?.owner != null && job?.owner._id !== userId;

    const JobCtas = CTAS[JOB_TYPE];

    return (
        <div className="flex h-full gap-6">
            <div className="scrollbar-hide flex h-full grow flex-col overflow-y-auto pb-20">
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

                <div className="flex w-full grow flex-col rounded-b-xl border border-t-0 border-line bg-white p-6">
                    <JobSkills skills={job.tags ?? []} />
                    <JobDescription description={job.description} />
                    <JobDeliverables
                        deliverables={job.collections.filter(isJobDeliverable).map((collection) => collection.name)}
                    />

                    {hasAlreadyApplied && (
                        <div className="my-3 flex w-full items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 p-4 text-blue-500">
                            <Info size={20} />
                            <span className="text-center text-body">You have already applied to this job</span>
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
                                This job is already assigned to another talent. You can apply to other jobs.
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex h-full w-fit basis-[270px] flex-col items-center gap-7" />
        </div>
    );
};

interface Props {
    params: {
        "job-id": string;
    };
}

export default function JobDetails({ params }: Props): React.ReactElement {
    const jobId = params["job-id"];
    const accountQuery = useGetAccount();
    const jobQuery = useGetJobById({ jobId });
    if (jobQuery.isError || accountQuery.isError) return <PageError className="absolute inset-0" />;
    if (jobQuery.isLoading || accountQuery.isLoading) return <PageLoading className="absolute inset-0" />;

    const { data: job } = jobQuery;
    const { data: account } = accountQuery;
    const USER_ROLE: "client" | "talent" = account?._id === job.creator._id ? "client" : "talent";

    const VIEWS = {
        client: ClientJobDetails,
        talent: TalentJobDetails,
    };

    const CurrentView = VIEWS[USER_ROLE];

    return (
        <div className="h-full">
            <CurrentView job={job} userId={account._id} />
        </div>
    );
}
