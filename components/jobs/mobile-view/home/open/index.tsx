"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "usehooks-ts";
import { Search, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageError } from "@/components/common/page-error";
import { Tabs } from "@/components/common/tabs";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { useGetJobsInfinitely } from "@/lib/api/job";
import { createQueryStrings2 } from "@/lib/utils";
import { AllJobs } from "./all";
import { SavedJobs } from "./saved";
import { Button } from "@/components/common/button";
import { type Job } from "@/lib/types";
import { OpenHeader } from "./header";

export const OpenJobs = (): JSX.Element | null => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [showSearch, setShowSearch] = useState(false);
    const [viewAll, setViewAll] = useState(false);

    const observerTarget = useRef<HTMLDivElement | null>(null);
    const [observe, setObserve] = useState(false);

    // eslint-disable-next-line prefer-const
    let prevPage = 0;
    // eslint-disable-next-line prefer-const
    let currentPage = 1;

    const [currentData, setCurrentData] = useState<Job[]>([]);

    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") ?? ""
    );
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const [skillsQuery, setSkillsQuery] = useState(
        searchParams.get("skills") ?? ""
    );
    const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

    const [minimumPriceQuery, setMinimumPriceQuery] = useState(
        searchParams.get("range")?.split(",")[0] ?? ""
    );
    const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

    const [maximumPriceQuery, setMaximumPriceQuery] = useState(
        searchParams.get("range")?.split(",")[1] ?? 100
    );
    const debouncedMaximumPriceQuery = useDebounce(maximumPriceQuery, 300);

    useEffect(() => {
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

    const queryParams = new URLSearchParams(searchParams);
    const searchQ = queryParams.get("search") ?? "";
    const skillQ = queryParams.get("skills") ?? "";
    const rangeQ = queryParams.get("range") ?? "";

    const {
        data: jobsData,
        isError: jobIsError,
        refetch: jobRefetch,
        isLoading: jobIsLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useGetJobsInfinitely({
        category: "open",
        status: "pending",
        filter: {
            search: searchQ,
            tags: skillQ,
            range: searchQuery ? rangeQ : "",
            page: currentPage,
            limit: 3,
        },
    });

    const bookmarkData = useGetBookmarks({
        page: 1,
        limit: 5,
        filter: { type: "collection" },
    });

    const onRefresh = async (): Promise<void> => {
        await Promise.all([jobRefetch(), bookmarkData.refetch()]);
    };
    // ========Infinite Scroll

    const fetchMore = (): void => {
        if (hasNextPage && !isFetchingNextPage) {
            setObserve(false);
            void fetchNextPage();
        }
    };

    useEffect(() => {
        const currentTarget = observerTarget.current;
        if (!currentTarget) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) setObserve(true);
            },
            { threshold: 0.5 }
        );

        observer.observe(currentTarget);

        return () => {
            observer.unobserve(currentTarget);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [observerTarget.current]);

    useEffect(() => {
        if (!jobIsLoading && !isFetchingNextPage && prevPage !== currentPage) {
            void jobRefetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    useEffect(() => {
        if (observe) {
            fetchMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [observe]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let totalData: any = [];
        if (jobsData && Array.isArray(jobsData.pages)) {
            for (let i = 0; i < jobsData.pages.length; i++) {
                const jData = jobsData.pages[i];
                if (Array.isArray(jData)) {
                    totalData = [...totalData, ...jData];
                }
            }
        }
        setCurrentData(totalData);
    }, [jobsData, jobsData?.pages]);
    // ========Infinite Scroll

    // sort jobs by latest first
    const sortedJobs = currentData?.sort((a, b) => {
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    // This useEffect is used to hide the remaining search input when the user closes the search
    useEffect(() => {
        if (!showSearch) {
            setViewAll(false);
        }
    }, [showSearch]);

    return jobIsError || bookmarkData.isError ? (
        <PageError className="h-full rounded-2xl border border-red-200 bg-red-50" />
    ) : (
        <div className="flex h-full flex-col gap-6">
            <div className="flex h-full grow">
                <Tabs
                    urlKey="open-jobs"
                    tabs={[
                        {
                            label: "All",
                            value: "all",
                            content: (
                                <AllJobs
                                    jobs={sortedJobs}
                                    onRefresh={onRefresh}
                                    loading={jobIsLoading}
                                    isFetchingNextPage={isFetchingNextPage}
                                    ref={observerTarget}
                                />
                            ),
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
                    className="relative h-full border-none"
                    tabListClassName="max-sm:justify-normal bg-emerald-900 border-none px-5"
                    tabTriggerClassName="radix-state-active:text-white text-white radix-state-active:border-white border-b-[3px] py-[11px]"
                    customExtraItem={
                        <Button
                            className="absolute right-6 z-10 !m-0 flex items-center justify-center !p-0"
                            onClick={() => {
                                setShowSearch(!showSearch);
                            }}
                        >
                            {showSearch ? (
                                <X className="h-6 w-6 text-white transition-transform duration-300" />
                            ) : (
                                <Search className="h-6 w-6 text-white transition-transform duration-300" />
                            )}
                        </Button>
                    }
                    customExtraComponent={
                        <div
                            className={`relative z-10 flex h-auto w-full flex-col bg-emerald-900 p-4 ${!showSearch ? "hidden" : ""}`}
                        >
                            <OpenHeader
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                skillsQuery={skillsQuery}
                                setSkillsQuery={setSkillsQuery}
                                minimumPriceQuery={minimumPriceQuery}
                                setMinimumPriceQuery={setMinimumPriceQuery}
                                maximumPriceQuery={maximumPriceQuery}
                                setMaximumPriceQuery={setMaximumPriceQuery}
                                viewAll={viewAll}
                                setViewAll={setViewAll}
                            />
                        </div>
                    }
                />
            </div>
        </div>
    );
};
