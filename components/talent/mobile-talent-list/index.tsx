"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

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

interface TalentListProps {
	talents: TalentProps[];
	// currentPage: number;
	// totalPages: number;
	// handlePagination: (page: number) => void;
	isLoading?: boolean;
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

export const MobileTalentList = ({
	isLoading,
	talents,
	// currentPage,
	// totalPages,
	// handlePagination,
}: TalentListProps): React.JSX.Element => {
	return (
		<div className="h-full w-full">
			{!isLoading ? (
				<div className="flex h-full flex-col">
					<div className="flex flex-col items-center justify-center">
						{talents.length > 0 &&
							talents.map((t: TalentProps, i: number) => (
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
					</div>
					{talents.length === 0 && <RenderEmpty />}
				</div>
			) : (
				<RenderLoading />
			)}
		</div>
	);
};
