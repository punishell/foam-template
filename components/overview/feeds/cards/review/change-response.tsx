"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { Button } from "pakt-ui";
import { X, Briefcase } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { SideModal } from "@/components/common/side-modal";
import { useHeaderScroll } from "@/lib/store";
import { titleCase } from "@/lib/utils";
import { MobileSheetWrapper } from "@/components/common/mobile-sheet-wrapper";

import { ClientJobModal } from "@/components/jobs/desktop-view/sheets/client";
import { TalentJobModal } from "@/components/jobs/desktop-view/sheets/talent";

import { TalentJobSheetForMobile } from "@/components/jobs/mobile-view/sheets/talent";
import { ClientJobModalForMobile } from "@/components/jobs/mobile-view/sheets/client";

interface ReviewResponseChangeProps {
	id: string;
	title: string;
	description: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	bookmarked: boolean;
	bookmarkId: string;
	jobId: string;
	isCreator: boolean;
	isDeclined: boolean;
	close?: (id: string) => void;
}

export const ReviewResponseChangeCard = ({
	id,
	title,
	jobId,
	description,
	creator,
	talent,
	bookmarked,
	bookmarkId,
	isCreator,
	isDeclined,
	close,
}: ReviewResponseChangeProps): ReactElement => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mobileSheet, setMobileSheet] = useState(false);
	const { setScrollPosition } = useHeaderScroll();

	const tab = useMediaQuery("(min-width: 640px)");

	return tab ? (
		<div
			className={`${isDeclined ? "border-[#FF5247] bg-[#FFF4F4]" : "border-[#9BDCFD] bg-[#F1FBFF]"}
			relative z-10 flex h-[174px] w-full gap-4 overflow-hidden rounded-2xl border p-4`}
		>
			<AfroProfile
				src={isCreator ? talent.avatar : creator.avatar}
				score={isCreator ? talent.score : creator.score}
				size="lg"
				url={`/talents/${isCreator ? talent._id : creator._id}`}
			/>
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-title">{title}</h3>
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

				<p className="text-body">{description}</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							size="xs"
							variant="outline"
							onClick={() => {
								setIsModalOpen(true);
							}}
						>
							{isDeclined ? "Review" : "Update"}
						</Button>
					</div>
					<RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
				</div>
			</div>

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Briefcase size={200} color="#F2F4F5" />
			</div>

			<SideModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
				{isCreator ? (
					<ClientJobModal
						jobId={jobId}
						talentId={talent._id}
						closeModal={() => {
							setIsModalOpen(false);
						}}
						extras={id}
					/>
				) : (
					<TalentJobModal
						jobId={jobId}
						talentId={talent._id}
						closeModal={() => {
							setIsModalOpen(false);
						}}
						extras={id}
					/>
				)}
			</SideModal>
		</div>
	) : (
		<div
			className={`${isDeclined ? "border-[#FF5247] bg-[#FFF4F4]" : "border-[#9BDCFD] bg-[#F1FBFF]"}
			z-10 flex flex-col w-full gap-4 overflow-hidden border-b px-[21px] py-4`}
			role="button"
			tabIndex={0}
			onClick={() => {
				setScrollPosition(1);
				setMobileSheet(true);
			}}
			onKeyDown={() => {
				setMobileSheet(true);
			}}
		>
			<div className="flex items-center gap-2 relative -left-[5px]">
				<AfroProfile
					src={isCreator ? talent.avatar : creator.avatar}
					score={isCreator ? talent.score : creator.score}
					size="sm"
					url={`/talents/${isCreator ? talent._id : creator._id}`}
				/>
				<div className="flex-col justify-start items-start inline-flex">
					<p className="text-gray-800 text-lg flex leading-[27px] tracking-wide">{talent.name}</p>
					<span className="text-gray-500 text-xs leading-[18px] tracking-wide">
						{titleCase(talent.title)}
					</span>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2">
				<h3 className="text-base font-medium text-title">{title}</h3>
				<div className="mt-auto flex items-center justify-between">
					<p className="capitalize text-body text-base">{description}</p>
					<RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
				</div>
			</div>

			{/* Sidebar Sheet */}
			<MobileSheetWrapper isOpen={mobileSheet}>
				{isCreator ? (
					<ClientJobModalForMobile
						jobId={jobId}
						talentId={talent._id}
						closeModal={() => {
							setScrollPosition(0);
							setMobileSheet(false);
						}}
						extras={id}
					/>
				) : (
					<TalentJobSheetForMobile
						jobId={jobId}
						talentId={talent._id}
						closeModal={() => {
							setScrollPosition(0);
							setMobileSheet(false);
						}}
						extras={id}
					/>
				)}
			</MobileSheetWrapper>
		</div>
	);
};
