"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Tag, SlidersHorizontal, Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";
import { type JobApplicant, type Job, isJobApplicant } from "@/lib/types";
import { type GetAccountResponse } from "@/lib/api/account";
import { ApplicantCard } from "./card";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Button } from "@/components/common/button";
import { FilterApplicantModal } from "./filter";

interface Props {
    job: Job;
    account: GetAccountResponse | undefined;
}

type SortBy = "highest-to-lowest" | "lowest-to-highest";

export const MobileApplicantView = ({ job, account }: Props): JSX.Element => {
    const [displayedApplicants, setDisplayedApplicants] = useState<
        JobApplicant[]
    >([]);
    const [loading, setLoading] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const totalApplicantsRef = useRef<JobApplicant[]>([]);

    const itemsPerPage = 5;

    const [skillFilters, setSkillFilters] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"score" | "bid">("score");
    const [bidSort, setBidSort] = useState<SortBy>("highest-to-lowest");
    const [scoreSort, setScoreSort] = useState<SortBy>("highest-to-lowest");
    const [openFilter, setOpenFilter] = useState<boolean>(false);

    const router = useRouter();

    const sortFunction = (
        a: JobApplicant,
        b: JobApplicant,
        key: (obj: JobApplicant) => number,
        order: SortBy
    ): number => {
        if (order === "highest-to-lowest") {
            return key(b) - key(a);
        }

        if (order === "lowest-to-highest") {
            return key(a) - key(b);
        }

        return 0;
    };
    const loadMoreApplicants = useCallback((): void => {
        if (
            loading ||
            displayedApplicants.length >= totalApplicantsRef.current.length
        ) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const nextSet = totalApplicantsRef.current.slice(
                displayedApplicants.length,
                displayedApplicants.length + itemsPerPage
            );
            setDisplayedApplicants((current) => [...current, ...nextSet]);
            setLoading(false);
        }, 1500); // Simulates loading time
    }, [displayedApplicants.length, loading]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0]?.isIntersecting &&
                    !loading &&
                    displayedApplicants.length <
                        totalApplicantsRef.current.length
                ) {
                    setLoading(true);
                    loadMoreApplicants();
                }
            },
            { threshold: 1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [loading, loadMoreApplicants, displayedApplicants.length]);

    useEffect(() => {
        const applicants = job.collections.filter(isJobApplicant);

        const filteredApplicants = applicants
            .filter((applicant) => {
                if (skillFilters.length === 0) return true;
                return applicant.creator.profile.talent.tags
                    .map((skill) => skill.toLowerCase())
                    .some((skill) =>
                        skillFilters.includes(skill.toLowerCase())
                    );
            })
            .sort((a, b) => {
                const bidSortResult = sortFunction(
                    a,
                    b,
                    (value) => value.paymentFee,
                    bidSort
                );
                const scoreSortResult = sortFunction(
                    a,
                    b,
                    (value) => value.creator.score,
                    scoreSort
                );

                if (sortBy === "bid") return bidSortResult;
                if (sortBy === "score") return scoreSortResult;
                return 0;
            });

        totalApplicantsRef.current = filteredApplicants;
        setDisplayedApplicants(filteredApplicants.slice(0, itemsPerPage));
    }, [bidSort, job.collections, scoreSort, skillFilters, sortBy]);

    const skills = job.tagsData.join(",");

    const isClient = account?._id === job.creator._id;

    if (!isClient) return <PageError className="absolute inset-0" />;
    return (
        <>
            <FilterApplicantModal
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                job={job}
                setSortBy={setSortBy}
                setScoreSort={setScoreSort}
                setBidSort={setBidSort}
                skillFilters={skillFilters}
                setSkillFilters={setSkillFilters}
            />
            <Breadcrumb
                items={[
                    {
                        label: "Jobs",
                        action: () => {
                            router.push(`/jobs/${job._id}`);
                        },
                    },
                    { label: "Job Applicants", active: true },
                ]}
            />
            <div className="flex h-full flex-col">
                <div className="flex justify-between gap-4 bg-primary-gradient p-4 py-6">
                    <div className="flex max-w-3xl grow flex-col gap-3">
                        <h2 className="text-lg font-bold leading-[27px] tracking-wide text-neutral-50">
                            {job.name}
                        </h2>
                        <div className="mt-auto flex items-center gap-4">
                            <span className="flex items-center gap-2 rounded-lg bg-[#C9F0FF] px-3 py-1 text-sm text-[#0065D0]">
                                <Tag size={20} />
                                <span>$ {job.paymentFee}</span>
                            </span>

                            <span className="flex items-center gap-2 rounded-lg bg-[#ECFCE5] px-3 py-1 text-sm text-[#198155]">
                                <Calendar size={20} />
                                <span>
                                    Due{" "}
                                    {format(
                                        new Date(job.deliveryDate),
                                        "MMM dd, yyyy"
                                    )}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="inline-flex h-[76px] w-full items-center justify-between border-b border-green-300 bg-white px-[21px] py-4">
                    <div className="inline-flex flex-col items-start justify-center gap-0.5">
                        <div className="text-base font-bold leading-normal tracking-wide text-neutral-800">
                            All Applicants
                        </div>
                        <span className="text-xs leading-[18px] tracking-wide text-neutral-500">
                            Click on an applicant to view Profile
                        </span>
                    </div>
                    <Button
                        className="flex w-[94px] items-center justify-center gap-2 rounded-[10px] border border-neutral-500 px-4 py-2"
                        onClick={() => {
                            setOpenFilter(true);
                        }}
                    >
                        <span className="text-center text-sm font-bold leading-normal tracking-wide text-neutral-500">
                            Filter
                        </span>
                        <SlidersHorizontal className="text-neutral-500" />
                    </Button>
                </div>
                <div className="flex h-full w-full grow gap-6 overflow-hidden">
                    {displayedApplicants.length === 0 && (
                        <PageEmpty
                            className="h-full rounded-2xl"
                            label="No applicants yet"
                        >
                            <div className="mt-4 w-full">
                                <Button
                                    className="w-full"
                                    fullWidth
                                    onClick={() => {
                                        router.push(
                                            `/talents${skills ? `?skills=${skills}` : ""}`
                                        );
                                    }}
                                    variant="primary"
                                    size="lg"
                                >
                                    Find Talent
                                </Button>
                            </div>
                        </PageEmpty>
                    )}

                    {displayedApplicants.length === 0 && (
                        <PageEmpty
                            className="h-full rounded-2xl px-8"
                            label="No talent matches the criteria, try changing your filter"
                        />
                    )}

                    {displayedApplicants.length > 0 && (
                        <div className="flex flex-col gap-4 overflow-y-auto ">
                            {displayedApplicants.map((applicant) => (
                                <ApplicantCard
                                    key={applicant.creator._id}
                                    talent={applicant.creator}
                                    bid={applicant.paymentFee}
                                    message={applicant.description}
                                    inviteReceiverId={job.invite?.receiver._id}
                                />
                            ))}
                            {loading && (
                                <div className="mx-auto flex w-full flex-row items-center justify-center text-center">
                                    <Loader
                                        size={25}
                                        className="animate-spin text-center text-white"
                                    />
                                </div>
                            )}
                            <div ref={loadMoreRef} className="h-10" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
