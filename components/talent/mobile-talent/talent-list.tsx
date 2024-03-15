"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { forwardRef } from "react";
import { PageLoading } from "../../common/page-loading";
import { TalentCard } from "./talent-card";
import { type AchievementType } from "@/lib/utils";

interface TalentProps {
	_id: string;
	name: string;
	title?: string;
	score?: string;
	image?: string;
	skills: Array<{ name: string; color: string }>;
	achievements: Array<{
		total: number;
		value: string;
		type: AchievementType;
	}>;
}

interface MobileTalentListProps {
	talents: TalentProps[];
	isLoading?: boolean;
	isFetchingNextPage: boolean;
	// isError?: boolean;
}

const RenderLoading = (): React.JSX.Element => {
	return (
		<div className="z-20 my-auto flex h-full w-full items-center justify-center">
			<PageLoading color="#007C5B" />
		</div>
	);
};

const RenderEmpty = (): React.JSX.Element => {
	return (
		<div className="my-auto flex h-full w-full flex-row items-center justify-center text-center text-lg text-body">
			{" "}
			<p>no result found...</p>
		</div>
	);
};

export const TalentList = forwardRef<HTMLDivElement, MobileTalentListProps>((props, ref): JSX.Element => {
	const { talents, isLoading, isFetchingNextPage } = props;
	return (
		<div className="h-[calc(100%-76px)] w-full">
			{isLoading ? (
				<RenderLoading />
			) : talents.length > 0 ? (
				<div className="flex flex-col overflow-y-scroll h-full">
					{talents.map((t: TalentProps, i: number) => (
						<TalentCard
							key={i}
							id={t._id}
							name={t.name}
							title={t?.title ?? ""}
							score={t?.score ?? "0"}
							imageUrl={t?.image}
							skills={t?.skills}
						/>
					))}
					{isFetchingNextPage && (
						<div className="mx-auto max-sm:my-4 flex w-full flex-row items-center justify-center text-center">
							<Loader size={25} className="animate-spin text-center text-black" />
						</div>
					)}
					<span ref={ref} />
				</div>
			) : (
				<RenderEmpty />
			)}
		</div>
	);
});

TalentList.displayName = "TalentList";
