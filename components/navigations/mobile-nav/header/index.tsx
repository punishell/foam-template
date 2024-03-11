"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState, useEffect, useMemo } from "react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight, UserPlus } from "lucide-react";
import { UserBalance } from "@/components/common/user-balance";
import { ReferralSideModal } from "./refer";
import { useUserState } from "@/lib/store/account";
import { AfroProfile } from "@/components/common/afro-profile";
import { Button } from "../../../common/button";
import { useHeaderScroll, useLeaderboard } from "@/lib/store";
import { useGetTalentReviewById } from "@/lib/api";
import { hasFiveStarReview } from "@/lib/types";

export const MobileHeader = (): ReactElement => {
	const [referOpen, _setReferOpen] = useState(false);
	const [expand, setExpand] = useState(false);
	const { profileCompleteness, profileImage, _id } = useUserState();
	const { scrollPosition, setScrollPosition } = useHeaderScroll();
	const { setLeaderboardView } = useLeaderboard();

	const value = profileCompleteness ?? 0;
	const profileCompleted = value > 70;

	const { data: reviewData, refetch, isLoading } = useGetTalentReviewById(_id, "1", "100");

	// checking refer availability
	useEffect(() => {
		void refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const hasFiveStar = useMemo(() => {
		if (!reviewData || isLoading) return false;
		return hasFiveStarReview(reviewData.data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reviewData]);

	return (
		<>
			<div className="sm:hidden w-full relative overflow-hidden block !z-[9] bg-[#ECFCE5] h-auto max-h-max">
				<div
					className={`absolute -left-1 transition-all duration-300 transform translate-x-1/2 z-[5]
				${scrollPosition === 0 && profileCompleted ? "scale-[1.6] translate-y-1/2" : "scale-100 top-0 translate-y-[2%]"}`}
				>
					{profileImage?.url && value && (
						<AfroProfile size="sm" score={value} src={profileImage?.url} url="/profile" />
					)}
				</div>
				<div className="relative flex items-center justify-between px-5 w-full h-[65px] z-[3]">
					<div />
					<Image
						src="/icons/afro-fund.svg"
						alt="AfroFund Logo"
						width={35}
						height={37}
						className="cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
					/>
					<div
						className="flex items-center px-2 py-1 bg-lime-50 rounded-2xl border border-green-400 cursor-pointer"
						onClick={() => {
							setExpand(!expand);
						}}
						onKeyDown={() => {
							setExpand(!expand);
						}}
						role="button"
						tabIndex={0}
						aria-label="expand"
					>
						<UserBalance />
					</div>
				</div>
				<div
					className={`flex items-center bg-[#BCF68CD4] w-full px-5 overflow-hidden relative z-[2] transition-all duration-300  ${scrollPosition === 0 && profileCompleted ? "h-[78px]" : "h-[0px]"}`}
				>
					<div className="absolute inset-0 bg-[url(/images/rain.png)] bg-repeat opacity-50 -z-[1]" />
					<div className="flex items-center justify-between w-full z-20 gap-2">
						<Button
							className="w-[240px] h-[38px] bg-white rounded-[10px] border border-primary flex justify-end"
							onClick={() => {
								setLeaderboardView(true);
							}}
						>
							<div className="flex items-center gap-2">
								<span className="text-primary text-xs">View Leaderboard</span>
								<ChevronRight className="text-primary h-4 w-4" />
							</div>
						</Button>
						{hasFiveStar && (
							<Button
								className="border !border-primary bg-[#ECFCE5]"
								variant="outline"
								onClick={() => {
									setScrollPosition(1);
									_setReferOpen(true);
								}}
							>
								<UserPlus className="text-primary" />
							</Button>
						)}
					</div>
				</div>
			</div>
			<ReferralSideModal
				isOpen={referOpen}
				onOpenChange={(e) => {
					_setReferOpen(e);
				}}
			/>
		</>
	);
};
