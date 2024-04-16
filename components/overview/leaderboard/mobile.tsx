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
	const { data: leaderboardData, isFetched, isFetching } = useGetLeaderBoard();
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
			className={`flex sm:hidden h-[554px] w-full shrink-0 flex-col gap-2 rounded-2xl bg-gradient-leaderboard py-2 fixed z-50 transition-all duration-300 ease-in-out ${leaderboardView ? "bottom-0" : " -bottom-full"}`}
			ref={ref}
		>
			<div className="flex flex-col items-center justify-center gap-2 w-full">
				<div
					className="w-[43px] h-[7px] bg-zinc-300 bg-opacity-30 rounded-md"
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
				<h3 className="text-center text-slate-50 text-[22px] font-bold leading-[33px] tracking-wide">
					Leaderboard
				</h3>
			</div>

			<div className="scrollbar-hide relative flex flex-col gap-2 px-3 text-white overflow-y-scroll">
				{!isFetched && isFetching && <Spinner />}
				{leaderboard.map((l, i) => {
					if (l.position === 1)
						return <FirstPlace key={i} _id={l._id} name={l.name} score={l.score} avatar={l.image} />;
					if (l.position === 2)
						return <SecondPlace key={i} _id={l._id} name={l.name} score={l.score} avatar={l.image} />;
					if (l.position === 3)
						return <ThirdPlace key={i} _id={l._id} name={l.name} score={l.score} avatar={l.image} />;
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
