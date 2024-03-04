"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useEffect, useState } from "react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { UserBalance } from "@/components/common/user-balance";
import { ReferralSideModal } from "../overview/header/refer";
import { useUserState } from "@/lib/store/account";
// import { useGetTalentReviewById } from "@/lib/api";
// import { hasFiveStarReview } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";

export const MobileHeader = (): ReactElement => {
	const [referOpen, _setReferOpen] = useState(false);
	const [scrollY, setScrollY] = useState(0);
	const { profileCompleteness, profileImage } = useUserState();
	// const {
	// 	data: reviewData,
	// 	refetch,
	// 	isLoading,
	// } = useGetTalentReviewById(_id, "1", "100");

	// checking refer availability
	// useEffect(() => {
	// 	void refetch();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const value = profileCompleteness ?? 0;

	useEffect(() => {
		const handleScroll = (): void => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const scale = Math.min(1 + scrollY / 1000, 103 / 54);

	return (
		<div className="sm:hidden flex items-center h-[65px] justify-between relative top-0 left-0 right-0 bg-[#ECFCE5] px-4 !z-[99999] w-full">
			<ReferralSideModal
				isOpen={referOpen}
				onOpenChange={(e) => {
					_setReferOpen(e);
				}}
			/>
			<div className="relative !w-54 !h-54 overflow-hidden">
				<AfroProfile
					size="sm"
					score={value}
					src={profileImage?.url}
					style={{ transform: `scale(${scale})` }}
					className="absolute top-0 left-0 w-full h-full transition-transform duration-300 transform scale-100 hover:scale-110"
					url="/profile"
				/>
			</div>
			<Image
				src="/icons/afro-fund.svg"
				alt="AfroFund Logo"
				width={35}
				height={37}
				className="cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
			/>
			<div className="flex items-center px-2 py-1 bg-lime-50 rounded-2xl border border-green-400">
				<UserBalance />
			</div>
		</div>
	);
};
