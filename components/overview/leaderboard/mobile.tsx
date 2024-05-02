"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRef, type ReactElement } from "react";
import { useOnClickOutside } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetLeaderBoard } from "@/lib/api/dashboard";
import { Spinner } from "../../common";
import { RunnerUp } from "./runner-up";
import { FirstPlace } from "./first-place";
import { SecondPlace } from "./second-place";
import { ThirdPlace } from "./third-place";
import { useLeaderboard } from "@/lib/store";

export const MobileLeaderBoard = (): ReactElement => {
    const {
        data: leaderboardData,
        isFetched,
        isFetching,
    } = useGetLeaderBoard();
    const { leaderboardView, setLeaderboardView } = useLeaderboard();

    const ref = useRef(null);

    const leaderboard = (leaderboardData?.data ?? []).map((leader, i) => ({
        _id: leader?._id,
        name: `${leader?.firstName} ${leader?.lastName}`,
        image: leader?.profileImage?.url,
        score: leader?.score,
        position: i + 1,
    }));

    const handleClickOutside = (): void => {
        // Your custom logic here
        setLeaderboardView(false);
    };

    useOnClickOutside(ref, handleClickOutside);

    return (
        <div
            className={`fixed z-50 flex h-[554px] w-full shrink-0 flex-col gap-2 rounded-2xl bg-gradient-leaderboard py-2 transition-all duration-300 ease-in-out sm:hidden ${leaderboardView ? "bottom-0" : " -bottom-full"}`}
            ref={ref}
        >
            <div className="flex w-full flex-col items-center justify-center gap-2">
                <div
                    className="h-[7px] w-[43px] rounded-md bg-zinc-300 bg-opacity-30"
                    onClick={(e) => {
                        e.stopPropagation();
                        setLeaderboardView(false);
                    }}
                    onKeyDown={() => {
                        setLeaderboardView(false);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="close"
                />
                <h3 className="text-center text-[22px] font-bold leading-[33px] tracking-wide text-slate-50">
                    Leaderboard
                </h3>
            </div>

            <div className="scrollbar-hide relative flex flex-col gap-2 overflow-y-scroll px-3 text-white">
                {!isFetched && isFetching && <Spinner />}
                {leaderboard.map((l, i) => {
                    if (l.position === 1)
                        return (
                            <FirstPlace
                                key={i}
                                _id={l._id}
                                name={l.name}
                                score={l.score}
                                avatar={l.image}
                            />
                        );
                    if (l.position === 2)
                        return (
                            <SecondPlace
                                key={i}
                                _id={l._id}
                                name={l.name}
                                score={l.score}
                                avatar={l.image}
                            />
                        );
                    if (l.position === 3)
                        return (
                            <ThirdPlace
                                key={i}
                                _id={l._id}
                                name={l.name}
                                score={l.score}
                                avatar={l.image}
                            />
                        );
                    return (
                        <RunnerUp
                            key={i}
                            _id={l._id}
                            name={l.name}
                            score={l.score}
                            place={`${l.position}th`}
                            avatar={l.image}
                        />
                    );
                })}
            </div>
        </div>
    );
};
