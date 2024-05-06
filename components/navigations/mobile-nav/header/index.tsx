"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
    const pathname = usePathname();
    const [referOpen, _setReferOpen] = useState(false);
    const [expand, setExpand] = useState(false);
    const { profileCompleteness, profileImage, _id } = useUserState();
    const { scrollPosition, setScrollPosition } = useHeaderScroll();
    const { setLeaderboardView } = useLeaderboard();
    const value = profileCompleteness ?? 0;
    const profileCompleted = value > 70;

    const {
        data: reviewData,
        refetch,
        isLoading,
    } = useGetTalentReviewById(_id, "1", "100");

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

    useEffect(() => {
        if (pathname !== "/overview") {
            setScrollPosition(1);
        } else {
            setScrollPosition(0);
        }
    }, [pathname, setScrollPosition]);

    return (
        <>
            <div className="relative !z-[9] block h-auto max-h-max w-full overflow-hidden bg-[#ECFCE5] sm:hidden">
                <div
                    className={`absolute -left-1 z-[5] translate-x-1/2 transform transition-all duration-300
				${scrollPosition === 0 && profileCompleted ? "translate-y-1/2 scale-[1.6]" : "top-0 translate-y-[2%] scale-100"}`}
                >
                    {profileImage?.url && value && (
                        <AfroProfile
                            size="sm"
                            score={value}
                            src={profileImage?.url}
                            url="/profile"
                            className={`${scrollPosition === 0 && profileCompleted ? "-left-[5px]" : "-left-[15px]"} relative -left-[5px] transition-all duration-300`}
                        />
                    )}
                </div>
                <div className="relative z-[3] flex h-[65px] w-full items-center justify-between px-5">
                    <div />
                    <Image
                        src="/icons/afro-fund.svg"
                        alt="AfroFund Logo"
                        width={35}
                        height={37}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
                    />
                    <div
                        className="flex cursor-pointer items-center rounded-2xl border border-green-400 bg-lime-50 px-2 py-1"
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
                    className={`relative z-[2] flex w-full items-center overflow-hidden bg-[#BCF68CD4] px-5 transition-all duration-150 ${scrollPosition === 0 && profileCompleted ? "h-[78px]" : "h-[0px]"}`}
                >
                    <div className="absolute inset-0 -z-[1] bg-[url(/images/rain.png)] bg-repeat opacity-50" />
                    <div className="z-20 flex w-full items-center justify-between gap-2">
                        <Button
                            className="flex h-[38px] w-[240px] justify-end rounded-[10px] border border-primary bg-white"
                            onClick={() => {
                                setLeaderboardView(true);
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-primary">
                                    View Leaderboard
                                </span>
                                <ChevronRight className="h-4 w-4 text-primary" />
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
