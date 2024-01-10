import React, { useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "usehooks-ts";

import { NumericInput } from "@/components/common/numeric-input";
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { Pagination } from "@/components/common/pagination";
import { Tabs } from "@/components/common/tabs";
import { OpenJobCard } from "@/components/jobs/job-cards/open-job";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { useGetJobs } from "@/lib/api/job";
import type { Bookmark, Job } from "@/lib/types";
import { createQueryStrings2, paginate } from "@/lib/utils";

export const OpenJobs = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const [skillsQuery, setSkillsQuery] = useState(searchParams.get("skills") || "");
    const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

    const [minimumPriceQuery, setMinimumPriceQuery] = useState(searchParams.get("range")?.split(",")[0] || 0);
    const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

    const [maximumPriceQuery, setMaximumPriceQuery] = useState(searchParams.get("range")?.split(",")[1] || 100);
    const debouncedMaximumPriceQuery = useDebounce(maximumPriceQuery, 300);

    React.useEffect(() => {
        const queries = createQueryStrings2({
            skills: debouncedSkillsQuery ?? "",
            search: debouncedSearchQuery ?? "",
            range: `${debouncedMinimumPriceQuery ?? 0},${debouncedMaximumPriceQuery ?? 100}`,
        });

        router.push(`${pathname}?${queries}`);
    }, [
        router,
        pathname,
        debouncedSearchQuery,
        debouncedSkillsQuery,
        debouncedMinimumPriceQuery,
        debouncedMaximumPriceQuery,
    ]);

    const queryParams = new URLSearchParams(searchParams as any);
    const searchQ = queryParams.get("search") || "";
    const skillQ = queryParams.get("skills") || "";
    const rangeQ = queryParams.get("range") || "";
    console.log(searchQ, skillQ, rangeQ);
    const jobsData = useGetJobs({
        category: "open",
        status: "pending",
        filter: { search: searchQ, tags: skillQ, range: rangeQ },
    });
    const bookmarkData = useGetBookmarks({ page: 1, limit: 5, filter: { type: "collection" } });

    if (jobsData.isError || bookmarkData.isError)
        return <PageError className="h-[85vh] rounded-2xl border border-red-200 bg-red-50" />;
    if (jobsData.isLoading) return <PageLoading className="h-[85vh] rounded-2xl border border-line" />;

    const jobs = jobsData.data.data;

    // sort jobs by latest first
    const sortedJobs = jobs.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const onRefresh = async () => {
        await Promise.all([jobsData.refetch(), bookmarkData.refetch()]);
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex w-full items-end gap-4 rounded-2xl border border-[#7DDE86] bg-white p-6">
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                        Search
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        placeholder="Name, Category, etc."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                    />
                </div>
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                        Skill
                    </label>
                    <input
                        type="text"
                        value={skillsQuery}
                        placeholder="Java, Solidity, etc."
                        onChange={(e) => setSkillsQuery(e.target.value)}
                        className="h-11 rounded-lg border border-line bg-gray-50 px-3 focus:outline-none"
                    />
                </div>
                <div className="relative flex grow flex-col gap-1">
                    <label htmlFor="" className="text-sm">
                        Afroscore
                    </label>
                    <div className="flex h-11 gap-2 rounded-lg border border-line bg-gray-50 py-2">
                        <NumericInput
                            type="text"
                            value={minimumPriceQuery}
                            placeholder="From"
                            onChange={(e) => setMinimumPriceQuery(e.target.value)}
                            className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
                        />
                        <div className="border-r border-line" />
                        <NumericInput
                            type="text"
                            placeholder="To"
                            value={maximumPriceQuery}
                            onChange={(e) => setMaximumPriceQuery(e.target.value)}
                            className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex h-full grow">
                <Tabs
                    urlKey="open-jobs"
                    tabs={[
                        {
                            label: "All",
                            value: "all",
                            content: <AllJobs jobs={sortedJobs} onRefresh={onRefresh} />,
                        },
                        {
                            label: "Saved",
                            value: "saved",
                            content: (
                                <SavedJobs
                                    jobs={bookmarkData.data?.data ?? []}
                                    isError={bookmarkData.isError}
                                    isLoading={bookmarkData.isLoading}
                                    onRefresh={onRefresh}
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

interface AllJobsProps {
    jobs: Job[];
    onRefresh?: () => void;
}

const AllJobs: React.FC<AllJobsProps> = ({ jobs, onRefresh }) => {
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.ceil(jobs.length / itemsPerPage);
    const paginatedJobs = paginate(jobs, itemsPerPage, currentPage);

    if (!jobs.length)
        return <PageEmpty label="No open jobs yet." className="h-[70vh] rounded-2xl border border-line" />;

    return (
        <div className="xh-full flex min-h-[70vh] flex-col gap-2 pb-2">
            <div className="grid grid-cols-2 gap-4 overflow-y-auto ">
                {paginatedJobs.map(({ _id, paymentFee, name, tags, creator, isBookmarked, bookmarkId }) => {
                    return (
                        <OpenJobCard
                            id={_id}
                            key={_id}
                            price={paymentFee}
                            title={name}
                            skills={tags}
                            creator={{
                                _id: creator._id,
                                paktScore: creator.score,
                                avatar: creator.profileImage?.url,
                                name: `${creator.firstName} ${creator.lastName}`,
                            }}
                            isBookmarked={isBookmarked}
                            bookmarkId={bookmarkId ?? ""}
                            onRefresh={onRefresh}
                        />
                    );
                })}
            </div>
            <div className="mt-auto">
                <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    );
};

interface SavedJobsProps {
    isError: boolean;
    isLoading: boolean;
    jobs: Bookmark[];
    onRefresh?: () => void;
}

const SavedJobs: React.FC<SavedJobsProps> = ({ jobs, isError, isLoading, onRefresh }) => {
    if (isError) return <PageError />;
    if (isLoading) return <PageLoading />;
    if (!jobs.length)
        return (
            <PageEmpty
                label="Your saved jobs will appear here."
                className="h-full rounded-lg border border-line py-6"
            />
        );

    return (
        <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
            {jobs.map(({ _id: bookmarkId, data: { _id, paymentFee, name, tags, creator } }) => {
                return (
                    <OpenJobCard
                        id={_id}
                        key={_id}
                        price={paymentFee}
                        title={name}
                        skills={tags}
                        creator={{
                            _id: creator._id,
                            paktScore: creator.score,
                            avatar: creator.profileImage?.url,
                            name: `${creator.firstName} ${creator.lastName}`,
                        }}
                        isBookmarked={true}
                        bookmarkId={bookmarkId ?? _id}
                        onRefresh={onRefresh}
                    />
                );
            })}
        </div>
    );
};
