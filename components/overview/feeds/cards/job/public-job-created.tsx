"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "pakt-ui";
import { X } from "lucide-react";
import Link from "next/link";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { titleCase } from "@/lib/utils";

export const PublicJobCreatedFeed = ({
	creator,
	title,
	amount,
	jobId,
	_id,
	bookmark,
	callback,
	close,
}: {
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	title: string;
	amount: string;
	jobId: string;
	_id: string;
	bookmark: { active: boolean; id: string };
	callback?: () => void;
	close?: (id: string) => void;
}): ReactElement => {
	return (
		<>
			<div className="relative z-10 hidden sm:flex w-full gap-4 overflow-hidden rounded-2xl border border-[#CDCFD0] bg-[#F9F9F9] px-4 pl-2">
				<AfroProfile
					score={creator.score}
					src={creator.avatar}
					size="lg"
					url={`/talents/${creator._id}`}
				/>
				<div className="flex w-full flex-col gap-4 py-4">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold text-body">
							{creator.name} created a{" "}
							<span className="inline-flex rounded-full bg-green-300 px-2 text-lg text-title">
								${amount ?? 0}
							</span>{" "}
							public job
						</h3>
						{close && (
							<X
								size={20}
								className="cursor-pointer"
								onClick={() => {
									close(_id);
								}}
							/>
						)}
					</div>
					<h3 className="text-2xl font-normal text-title">{title}</h3>
					<div className="mt-auto flex items-center justify-between">
						<Link
							href={`/jobs/${jobId}`}
							className="flex items-center gap-2"
						>
							<Button size="xs" variant="secondary">
								See Details
							</Button>
						</Link>
						<RenderBookMark
							size={20}
							isBookmarked={bookmark.active}
							type="feed"
							id={_id}
							bookmarkId={bookmark.id}
							callback={callback}
						/>
					</div>
				</div>
			</div>
			{/* Mobile */}
			<Link
				href={`/jobs/${jobId}`}
				className="relative z-10 flex sm:hidden w-full flex-col gap-4 overflow-hidden border-b border-[#CDCFD0] bg-[#F9F9F9] px-[21px] py-4"
			>
				<div className="flex items-center gap-2 relative -left-[5px]">
					<AfroProfile
						score={creator.score}
						src={creator.avatar}
						size="sm"
						url={`/talents/${creator._id}`}
					/>
					<div className="flex-col justify-start items-start inline-flex">
						<p className="text-gray-800 text-lg flex leading-[27px] tracking-wide">
							{creator.name}
						</p>
						<span className="text-gray-500 text-xs leading-[18px] tracking-wide">
							{titleCase(creator.title)}
						</span>
					</div>
				</div>
				<div className="flex w-full flex-col gap-2">
					<div className="flex items-center justify-between">
						<h3 className="text-base font-bold text-body">
							{creator.name} created a{" "}
							<span className="inline-flex rounded-full bg-green-300 px-2 text-lg text-title">
								${amount ?? 0}
							</span>{" "}
							public job
						</h3>
					</div>
					<div className="flex items-center justify-between gap-2">
						<h3 className="text-lg font-normal text-black">
							{title}
						</h3>
						<RenderBookMark
							size={20}
							isBookmarked={bookmark.active}
							type="feed"
							id={_id}
							bookmarkId={bookmark.id}
							callback={callback}
						/>
					</div>
				</div>
			</Link>
		</>
	);
};
