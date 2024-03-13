"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageLoading } from "../../common/page-loading";
import { TalentCard } from "./talent-card";
import { createQueryStrings2, type AchievementType } from "@/lib/utils";
import { useGetTalentInfinitely } from "@/lib/api";
import { type User } from "@/lib/types";
import { TalentHeader } from "./header";
import { TalentList } from "./talent-list";

interface TalentProps {
	_id: string;
	firstName: string;
	lastName: string;
	profile?: {
		bio?: {
			title: string;
		};
		talent?: {
			tagsIds: Array<{ name: string; color: string }>;
		};
	};
	score?: string;
	profileImage?: {
		url: string;
	};
	achievements: Array<{
		total: number;
		value: string;
		type: AchievementType;
	}>;
}

interface MappedTalent {
	_id: string;
	name: string;
	title: string;
	score: string;
	image: string;
	skills: Array<{ name: string; color: string }>;
	achievements: Array<{
		total: number;
		value: string;
		type: AchievementType;
	}>;
}

const mapTalentData = (talent: TalentProps): MappedTalent => ({
	_id: talent._id,
	name: `${talent.firstName} ${talent.lastName}`,
	title: talent?.profile?.bio?.title ?? "",
	score: talent?.score ?? "0",
	image: talent?.profileImage?.url ?? "",
	skills: (talent?.profile?.talent?.tagsIds ?? []).map((t) => ({
		name: t.name,
		color: t.color,
	})),
	achievements: talent?.achievements.map((a) => ({
		total: a.total,
		value: a.value,
		type: a.type as AchievementType,
	})),
});

export const MobileTalent = (): React.JSX.Element => {
	const [isSearching, setIsSearching] = useState(true);

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const observerTarget = useRef<HTMLDivElement | null>(null);
	const [observe, setObserve] = useState(false);
	const [prevPage, setPrevPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentData, setCurrentData] = useState<MappedTalent[]>([]);

	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const [skillsQuery, setSkillsQuery] = useState(searchParams.get("skills") ?? "");
	const debouncedSkillsQuery = useDebounce(skillsQuery, 300);

	const [minimumPriceQuery, setMinimumPriceQuery] = useState(searchParams.get("range")?.split(",")[0] ?? 0);
	const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

	const [maximumPriceQuery, setMaximumPriceQuery] = useState(searchParams.get("range")?.split(",")[1] ?? 100);
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
	// const Limit = queryParams.get("limit") ?? "6";
	// const page = queryParams.get("page") ?? "1";
	const searchQ = queryParams.get("search") ?? "";
	const skillQ = queryParams.get("skills") ?? "";
	const rangeQ = queryParams.get("range") ?? "";

	// const createQueryString = useCallback(
	// 	(name: string, value: string) => {
	// 		const params = new URLSearchParams(searchParams);
	// 		params.set(name, value);
	// 		return params.toString();
	// 	},
	// 	[searchParams],
	// );

	const {
		data: talentData,
		refetch: talentRefetch,
		isFetched,
		isFetching,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetTalentInfinitely({
		page: currentPage,
		limit: 6,
		filter: {
			search: searchQ,
			tags: skillQ,
			range: rangeQ,
			profileCompletenessMin: 70,
			profileCompletenessMax: 100,
			owner: true,
		},
	});

	const fetchMore = (): void => {
		setObserve(false);
		if (hasNextPage && !isFetchingNextPage) {
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
			{ threshold: 0.5 },
		);

		observer.observe(currentTarget);

		return () => {
			observer.unobserve(currentTarget);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [observerTarget.current]);

	useEffect(() => {
		if (!isLoading && !isFetchingNextPage && prevPage !== currentPage) {
			void talentRefetch();
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
		// if (timelineData?.pages) {
		if (talentData && Array.isArray(talentData.pages)) {
			for (let i = 0; i < talentData.pages.length; i++) {
				const timeData = talentData.pages[i];
				if (Array.isArray(timeData)) {
					totalData = [...totalData, ...timeData];
				}
			}
		}

		const newData = totalData.map(mapTalentData);
		setCurrentData(newData);
	}, [talentData, talentData?.pages]);

	// const talentLists = useMemo(() => {
	// 	setIsSearching(false);
	// 	return ((talentData?.data as TalentProps[]) ?? []).map(mapTalentData);
	// }, [talentData?.data]);

	console.log(observe);
	return (
		<div className="flex h-full flex-col sm:gap-6 overflow-auto">
			<TalentHeader
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				skillsQuery={skillsQuery}
				setSkillsQuery={setSkillsQuery}
				minimumPriceQuery={minimumPriceQuery}
				setMinimumPriceQuery={setMinimumPriceQuery}
				maximumPriceQuery={maximumPriceQuery}
				setMaximumPriceQuery={setMaximumPriceQuery}
			/>
			<TalentList
				isLoading={isLoading}
				talents={currentData}
				isFetchingNextPage={isFetchingNextPage}
				ref={observerTarget}
				isError={isError}
			/>
		</div>
	);
};
