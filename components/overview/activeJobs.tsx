import React, { useMemo } from "react";

import { Spinner } from "../common";
import { useGetTimeline } from "@/lib/api/dashboard";
import { FEED_TYPES } from "@/lib/utils";
import { ParseFeedView } from "./utils";
import { useUserState } from "@/lib/store/account";
import { PageEmpty } from "../common/page-empty";
import { PageLoading } from "../common/page-loading";
import { PageError } from "../common/page-error";
import { useGetJobs } from "@/lib/api/job";
import Link from "next/link";
import { Button } from "pakt-ui";
import { DeliverableProgressBar } from "../common/deliverable-progress-bar";
import { Briefcase } from "lucide-react";
import { SideModal } from "../common/side-modal";
import { TalentJobModal } from "../jobs/job-modals/talent";
import { ClientJobModal } from "../jobs/job-modals/client";
import { AfroProfile } from "../common/afro-profile";
import { Job } from "@/lib/types";
interface ActiveJobCardProps {
    id: string;
    title: string;
    description: string;
    talent: {
        _id: string;
        name: string;
        avatar: string;
        score: number;
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
}

const ActiveJobCard: React.FC<ActiveJobCardProps> = ({
    id,
    talent,
    creator,
    title,
    description,
    progress,
    isCreator,
}) => {
    const { _id: loggedInUser } = useUserState();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
    const profileAccount = creator?._id == loggedInUser ? talent : creator;
    return (
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
                            <Button size="xs" variant="secondary" onClick={() => setIsUpdateModalOpen(true)}>
                                {isCreator ? "View Updates" : "Update"}
                            </Button>
                            <Link href={`/messages?userId=${isCreator ? talent._id : creator._id}`}>
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
                onOpenChange={() => setIsUpdateModalOpen(false)}
                className="flex flex-col"
            >
                {!isCreator ? (
                    <TalentJobModal jobId={id} talentId={creator._id} closeModal={() => setIsUpdateModalOpen(false)} />
                ) : (
                    <ClientJobModal jobId={id} talentId={talent._id} closeModal={() => setIsUpdateModalOpen(false)} />
                )}
            </SideModal>
        </div>
    );
};

const talentAndClientHasReviewed = (job: Job) => {
    return (
        job.ratings?.some((review) => review.owner._id === job.owner?._id) &&
        job.ratings?.some((review) => review.owner._id === job.creator?._id)
    );
};

export const ActiveJobs = () => {
    const { _id: loggedInUser } = useUserState();
    const {
        data: jobAssignedData,
        isFetched: assignedFetched,
        isFetching: assignedFetching,
        isError: assignedError,
    } = useGetJobs({ category: "assigned" });
    const { data: jobCreatedData, isFetched, isFetching, isError } = useGetJobs({ category: "created" });
    const jobDataJoined = [...(jobAssignedData?.data || []), ...(jobCreatedData?.data || [])];

    const ongoingJobs = jobDataJoined.filter(
        (job) =>
            job.payoutStatus !== "completed" &&
            job.inviteAccepted &&
            !talentAndClientHasReviewed(job) &&
            job.status !== "cancelled",
    );
    const jobData = ongoingJobs.filter((f) => f.inviteAccepted);
    // @ts-ignore
    jobData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const activeJobs = useMemo(
        () =>
            (jobData || []).map((job, i) => {
                const deliverableTotal = job?.collections.filter((f) => f.type == "deliverable").length;
                const deliverableTotalCompleted = job?.collections.filter(
                    (f) => f.type == "deliverable" && f.progress == 100,
                ).length;
                const currentProgress = parseInt(String((deliverableTotalCompleted * 100) / deliverableTotal));
                const deliverableCountPercentage = {
                    total: deliverableTotal,
                    progress: Math.floor(currentProgress),
                };
                return (
                    <ActiveJobCard
                        key={i}
                        id={job._id}
                        bookmarkId=""
                        bookmarked={false}
                        progress={deliverableCountPercentage}
                        creator={{
                            _id: job.creator._id,
                            name: `${job?.creator?.firstName} ${job?.creator?.lastName}`,
                            avatar: job?.creator?.profileImage?.url || "",
                            score: job?.creator.score,
                        }}
                        talent={{
                            _id: job?.owner ? job?.owner._id : "",
                            name: `${job?.owner?.firstName} ${job?.owner?.lastName}`,
                            avatar: job?.owner?.profileImage?.url || "",
                            score: job?.owner ? job?.owner.score : 0,
                        }}
                        description={job.description}
                        title={job.name}
                        isCreator={job.creator._id == loggedInUser}
                        jobId={job._id}
                    />
                );
            }),
        [jobData],
    );
    if ((!isFetched || !assignedFetched) && (isFetching || assignedFetching))
        return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;
    if (isError || assignedError) return <PageError className="h-[85vh] rounded-2xl border border-red-200" />;
    if (activeJobs.length === 0)
        return (
            <PageEmpty className="h-[85vh] rounded-2xl border border-line" label="Your Active Jobs will appear here" />
        );

    return <div className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-white p-4">{activeJobs}</div>;
};
