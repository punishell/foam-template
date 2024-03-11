"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AchievementBar } from "./bar";
import { type AchievementType, type AchievementProps } from "./types";

export const Achievements = ({ achievements = [] }: AchievementProps): JSX.Element => {
	achievements.sort((a, b) => b.total - a.total);
	return (
		<div className="shrink-0 bg-white sm:bg-transparent sm:border-primary sm:rounded-2xl p-[4px] border-b sm:border-2">
			<div className="flex h-full w-full sm:w-fit shrink-0 flex-col items-start sm:items-center gap-4 sm:rounded-xl px-4 sm:px-6 py-4">
				<h3 className="text-center text-lg sm:text-2xl font-medium text-title">Achievements</h3>
				<div className="grid w-full grid-cols-4 gap-2">
					{achievements.length > 0 &&
						achievements.map(({ total, type, value }) => {
							return (
								<AchievementBar
									key={type}
									achievement={{
										minValue: 0,
										value: Math.floor(value),
										maxValue: total,
										type: type as AchievementType,
									}}
								/>
							);
						})}
					{achievements.length === 0 && (
						<>
							<AchievementBar
								achievement={{
									type: "review",
									maxValue: 60,
									minValue: 0,
									value: 0,
								}}
							/>
							<AchievementBar
								achievement={{
									type: "referral",
									maxValue: 20,
									minValue: 0,
									value: 0,
								}}
							/>
							<AchievementBar
								achievement={{
									type: "five-star",
									maxValue: 10,
									minValue: 0,
									value: 0,
								}}
							/>
							<AchievementBar
								achievement={{
									type: "squad",
									maxValue: 10,
									minValue: 0,
									value: 0,
								}}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
