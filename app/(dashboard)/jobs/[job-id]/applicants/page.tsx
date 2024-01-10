"use client";

import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Calendar, Tag } from "lucide-react";
import { Button, Select, Checkbox } from "pakt-ui";

import { isJobApplicant } from "@/lib/types";
import { type UserProfile, type JobApplicant } from "@/lib/types";
import { useGetJobById } from "@/lib/api/job";
import { useGetAccount } from "@/lib/api/account";
import { paginate } from "@/lib/utils";
import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";
import { Pagination } from "@/components/common/pagination";
import { PageLoading } from "@/components/common/page-loading";
import { AfroProfile } from "@/components/common/afro-profile";

interface ApplicantCardProps {
    bid: number;
    message?: string;
    talent: UserProfile;
    inviteReceiverId?: string;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ bid, talent, message, inviteReceiverId }) => {
    const router = useRouter();
    const { firstName, lastName, score, profileImage, profile } = talent;
    const hasBeenInvited = inviteReceiverId === talent._id;

    return (
        <div className="flex w-full flex-col gap-3 rounded-2xl border border-line bg-white p-4">
            <div className="flex w-full gap-4">
                {/* {
          <AfroScore score={score} size="md">
            <div className="h-full w-full rounded-full relative">
              {profileImage?.url ? (
                <Image src={profileImage.url} alt="profile" layout="fill" className="rounded-full" />
              ) : (
                <DefaultAvatar />
              )}
            </div>
          </AfroScore>
        } */}
                <AfroProfile score={score} size="md" src={profileImage?.url} />
                <div className="flex grow flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-title">{`${firstName} ${lastName}`}</span>

                            {hasBeenInvited && (
                                <span className="inline-flex rounded-full border border-green-400 bg-green-50 px-3 text-sm text-green-900">
                                    Invited
                                </span>
                            )}
                        </div>

                        <span className="inline-flex rounded-full bg-[#B2E9AA66] px-3 text-base text-title">
                            Bid ${bid}
                        </span>
                    </div>
                    <div className="grow text-lg text-body">{message}</div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {profile.talent.tagsIds &&
                        profile.talent.tagsIds.length > 0 &&
                        profile.talent.tagsIds.slice(0, 3).map((s) => (
                            <span
                                key={s.color + s.name}
                                style={{ background: s.color }}
                                className="grow whitespace-nowrap rounded-full bg-green-100 px-4 py-0.5 text-[#090A0A]"
                            >
                                {s.name}
                            </span>
                        ))}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => {
                            router.push(`/messages?userId=${talent._id}`);
                        }}
                    >
                        Message
                    </Button>
                    <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                            router.push(`/talents/${talent._id}`);
                        }}
                    >
                        View Profile
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface Props {
    params: {
        "job-id": string;
    };
}

const SORT_BY = [
    {
        label: "Highest to lowest",
        value: "highest-to-lowest",
    },
    {
        label: "Lowest to highest",
        value: "lowest-to-highest",
    },
];

type SortBy = "highest-to-lowest" | "lowest-to-highest";

export default function JobApplications({ params }: Props): React.JSX.Element {
    const router = useRouter();
    const jobId = params["job-id"];
    const accountData = useGetAccount();
    const jobData = useGetJobById({ jobId });
    const [skillFilters, setSkillFilters] = React.useState<string[]>([]);
    const [sortBy, setSortBy] = React.useState<"score" | "bid">("score");
    const [bidSort, setBidSort] = React.useState<SortBy>("highest-to-lowest");
    const [scoreSort, setScoreSort] = React.useState<SortBy>("highest-to-lowest");
    const [currentPage, setCurrentPage] = React.useState(1);

    if (jobData.isError) return <PageError className="absolute inset-0" />;
    if (jobData.isLoading) return <PageLoading className="absolute inset-0" />;

    const { data: job } = jobData;
    const { data: account } = accountData;

    const isClient = account?._id === job.creator._id;

    if (!isClient) return <PageError className="absolute inset-0" />;

    const applicants = job.collections.filter(isJobApplicant);

    const sortFunction = (
        a: JobApplicant,
        b: JobApplicant,
        key: (obj: JobApplicant) => number,
        order: SortBy,
    ): number => {
        if (order === "highest-to-lowest") {
            return key(b) - key(a);
        }

        if (order === "lowest-to-highest") {
            return key(a) - key(b);
        }

        return 0;
    };

    const filteredApplicants = applicants
        .filter((applicant) => {
            if (skillFilters.length === 0) return true;
            return applicant.creator.profile.talent.tags
                .map((skill) => skill.toLowerCase())
                .some((skill) => skillFilters.includes(skill.toLowerCase()));
        })
        .sort((a, b) => {
            const bidSortResult = sortFunction(a, b, (value) => value.paymentFee, bidSort);
            const scoreSortResult = sortFunction(a, b, (value) => value.creator.score, scoreSort);

            if (sortBy === "bid") return bidSortResult;
            if (sortBy === "score") return scoreSortResult;
            return 0;
        });

    const itemsPerPage = 3;
    const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

    const paginatedApplicants = paginate(filteredApplicants, itemsPerPage, currentPage);

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex justify-between gap-4 rounded-xl bg-primary-gradient p-4 py-6">
                <div className="flex max-w-3xl grow flex-col gap-3">
                    <h2 className="max-w-[750px] text-3xl font-bold text-white">{job.name}</h2>
                    <p className="max-w-[750px] text-white">{job.description}</p>
                    <div className="mt-auto flex items-center gap-4">
                        <span className="flex items-center gap-2 rounded-full bg-[#C9F0FF] px-3 py-1 text-[#0065D0]">
                            <Tag size={20} />
                            <span>$ {job.paymentFee}</span>
                        </span>

                        <span className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
                            <Calendar size={20} />
                            <span>Due {format(new Date(job.deliveryDate), "MMM dd, yyyy")}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex w-full  grow gap-6 overflow-hidden">
                <div className="flex h-fit shrink-0 grow-0 basis-[300px] flex-col gap-4 rounded-2xl border border-[#7DDE86] bg-white p-4">
                    <div>
                        <label htmlFor="score">Afroscore</label>
                        <Select
                            placeholder="Highest to lowest"
                            options={SORT_BY}
                            onChange={(value) => {
                                setSortBy("score");
                                setScoreSort(value as SortBy);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="bid">Bid</label>
                        <Select
                            placeholder="Highest to lowest"
                            options={SORT_BY}
                            onChange={(value) => {
                                setSortBy("bid");
                                setBidSort(value as SortBy);
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span>Preferred Skills</span>

                        <div className="flex flex-col gap-2">
                            {job.tagsData
                                .map((tag) => tag.toLowerCase())
                                .map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            if (skillFilters.includes(tag)) {
                                                setSkillFilters(skillFilters.filter((skill) => skill !== tag));
                                            } else {
                                                setSkillFilters([...skillFilters, tag]);
                                            }
                                        }}
                                        className="flex w-full items-center justify-between gap-2 rounded-lg border bg-gray-50 px-3 py-3 duration-300 hover:border-[#7DDE86]"
                                        type="button"
                                    >
                                        <span className="capitalize text-body">{tag}</span>
                                        <Checkbox checked={skillFilters.includes(tag)} />
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>

                {applicants.length === 0 && (
                    <PageEmpty className="h-[60vh] rounded-2xl" label="No applicants yet">
                        <div className="mt-4 w-full">
                            <Button
                                className="w-full"
                                fullWidth
                                onClick={() => {
                                    router.push(`/talents`);
                                }}
                            >
                                Find Talent
                            </Button>
                        </div>
                    </PageEmpty>
                )}

                {paginatedApplicants.length === 0 && applicants.length > 0 && (
                    <PageEmpty
                        className="h-[60vh] rounded-2xl"
                        label="No talent matches the criteria, try changing your filter"
                    />
                )}

                {paginatedApplicants.length > 0 && (
                    <div className="flex h-full grow flex-col gap-4 overflow-y-auto">
                        <div className="flex flex-col gap-4 overflow-y-auto ">
                            {paginatedApplicants.map((applicant) => (
                                <ApplicantCard
                                    key={applicant.creator._id}
                                    talent={applicant.creator}
                                    bid={applicant.paymentFee}
                                    message={applicant.description}
                                    inviteReceiverId={job.invite?.receiver._id}
                                />
                            ))}
                        </div>
                        <div className="pb-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
