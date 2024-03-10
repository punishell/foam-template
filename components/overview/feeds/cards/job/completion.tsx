"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { Button } from "pakt-ui";
import { Briefcase, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";
import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { SideModal } from "@/components/common/side-modal";
import { useHeaderScroll } from "@/lib/store";
import { titleCase } from "@/lib/utils";

import MobileSheetWrapper from "@/components/jobs/actions/mobile-sheets/sheet-wrapper";

import { ClientJobModal } from "@/components/jobs/actions/desktop-sheets/client";
import { TalentJobModal } from "@/components/jobs/actions/desktop-sheets/talent";

import { ClientJobModalForMobile } from "@/components/jobs/actions/mobile-sheets/client";
import { TalentJobSheetForMobile } from "@/components/jobs/actions/mobile-sheets/talent";

interface JobCompletedProps {
	id: string;
	title: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	bookmarked: boolean;
	bookmarkId: string;
	jobId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	isCreator: boolean;
	close?: (id: string) => void;
}
export const JobCompletionFeed = ({
	id,
	jobId,
	talent,
	creator,
	title,
	bookmarked,
	bookmarkId,
	isCreator,
	close,
}: JobCompletedProps): ReactElement => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mobileSheet, setMobileSheet] = useState(false);
	const { setScrollPosition } = useHeaderScroll();

	const tab = useMediaQuery("(min-width: 640px)");

	return tab ? (
		<div className="relative z-10 flex w-full gap-4  overflow-hidden rounded-2xl border border-[#9BDCFD] bg-[#F1FBFF] px-4 pl-2">
			<AfroProfile
				src={isCreator ? talent.avatar : creator.avatar}
				score={isCreator ? talent.score : creator.score}
				size="lg"
				url={`/talents/${isCreator ? talent._id : creator._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-body">{talent.name} completed all deliverables</h3>
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
				<p className="text-3xl text-title">{title}</p>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							size="xs"
							variant="secondary"
							onClick={() => {
								setIsModalOpen(true);
							}}
						>
							Review
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
			className="cursor-pointer z-10 flex sm:hidden w-full flex-col gap-4 overflow-hidden border-b border-[#9BDCFD] bg-[#F1FBFF] px-[21px] py-4"
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
				<h3 className="w-[90%] items-center text-base text-title font-medium">
					{talent.name} completed all deliverables
				</h3>
				<div className="mt-auto flex items-center justify-between">
					<p className="capitalize text-body text-base">{title}</p>
					<RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
				</div>
			</div>
			{/* Sidebar Sheet */}
			<MobileSheetWrapper
				closeSheet={() => {
					setScrollPosition(0);
					setMobileSheet(false);
				}}
				isOpen={mobileSheet}
				from="Jobs"
				to="Finalize & Review"
			>
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
