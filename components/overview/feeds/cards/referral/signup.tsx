"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Button } from "pakt-ui";
import { X, Briefcase } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { titleCase } from "@/lib/utils";

interface ReferralSignupFeedProps {
	id: string;
	name: string;
	userId: string;
	title?: string;
	description?: string;
	avatar?: string;
	score?: number;
	bookmarkId: string;
	bookmarked: boolean;
	close?: (id: string) => void;
	jobTitle?: string;
}
export const ReferralSignupFeed = ({
	id,
	title,
	description,
	userId,
	avatar,
	score,
	name,
	bookmarked,
	bookmarkId,
	close,
	jobTitle,
}: ReferralSignupFeedProps): JSX.Element => {
	const tab = useMediaQuery("(min-width: 640px)");

	return tab ? (
		<div className="relative z-10 flex h-[174px] w-full gap-4 overflow-hidden rounded-2xl border border-[#CDCFD0] bg-[#F9F9F9] p-4 pl-2">
			<AfroProfile src={avatar} score={Number(score)} size="lg" url={`/talents/${userId}`} />
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-title">{title ?? `${name} just signed up`}</h3>
					{close && (
						<X
							size={20}
							className="cursor-pointer"
							onClick={() => {
								close(id);
							}}
						/>
					)}
				</div>

				<p className="text-body">
					{description ??
						`Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
          support! 🙌`}
				</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Link href={`/messages?userId=${userId}`}>
							<Button size="xs" variant="outline">
								Message
							</Button>
						</Link>
					</div>
					<RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
				</div>
			</div>

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Briefcase size={200} color="#F2F4F5" />
			</div>
		</div>
	) : (
		<div className="z-10 flex w-full flex-col gap-4 overflow-hidden border-b border-[#CDCFD0] bg-[#F9F9F9] p-4 px-[21px]">
			<div className="flex items-center gap-2 relative -left-[5px]">
				<AfroProfile src={avatar} score={Number(score)} size="sm" url={`/talents/${userId}`} />
				<div className="flex-col justify-start items-start inline-flex">
					<p className="text-gray-800 text-lg flex leading-[27px] tracking-wide">{name}</p>
					<span className="text-gray-500 text-xs leading-[18px] tracking-wide">
						{titleCase(jobTitle as string)}
					</span>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2">
				<h3 className="text-xl font-bold text-title">{title ?? `${name} just signed up`}</h3>
				<div className="flex items-center justify-between">
					<p className="text-body">
						{description ??
							`Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
          support! 🙌`}
					</p>
					<RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
				</div>
			</div>
		</div>
	);
};
