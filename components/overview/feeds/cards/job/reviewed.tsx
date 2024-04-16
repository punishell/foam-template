"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";
import { X, Briefcase, Star } from "lucide-react";
import Rating from "react-rating";
import { Button } from "pakt-ui";
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

import { ClientJobModalForMobile } from "@/components/jobs/mobile-view/sheets/client";
import { TalentJobSheetForMobile } from "@/components/jobs/mobile-view/sheets/talent";

const MAX_LEN = 150;

interface ReviewJobProps {
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
	rating?: number;
	close?: (id: string) => void;
}

export const JobReviewedFeed = ({
	id,
	jobId,
	talent,
	creator,
	title,
	description,
	bookmarked,
	bookmarkId,
	isCreator,
	rating,
	close,
}: ReviewJobProps): ReactElement => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mobileSheet, setMobileSheet] = useState(false);
	const { setScrollPosition } = useHeaderScroll();

	const tab = useMediaQuery("(min-width: 640px)");

	return tab ? (
		<div className="relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl border border-[#9BDCFD] bg-[#F1FBFF] px-4 pl-2">
			<AfroProfile
				src={isCreator ? talent.avatar : creator.avatar}
				score={isCreator ? talent.score : creator.score}
				size="lg"
				url={`/talents/${isCreator ? talent._id : creator._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex justify-between">
					<h3 className="w-[90%] items-center text-xl text-title">
						{isCreator ? talent.name : creator.name} has reviewed your work on{" "}
						<span className="font-bold">{title}</span>
					</h3>
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
					{description.length > MAX_LEN ? `${description.slice(0, MAX_LEN)}...` : description}
				</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						{!isCreator && (
							<Button
								size="xs"
								variant="secondary"
								onClick={() => {
									setIsModalOpen(true);
								}}
							>
								Review
							</Button>
						)}
						{rating && (
							// @ts-expect-error -- Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.ts(2786)
							<Rating
								initialRating={rating}
								fullSymbol={<Star fill="#15D28E" color="#15D28E" className="mt-[4px]" />}
								emptySymbol={<Star fill="transparent" color="#15D28E" className="mt-[4px]" />}
								readonly
							/>
						)}
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
				if (!isCreator) {
					setScrollPosition(1);
					setMobileSheet(true);
				}
			}}
			onKeyDown={() => {
				if (!isCreator) {
					setScrollPosition(1);
					setMobileSheet(true);
				}
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
					{isCreator ? talent.name : creator.name} has reviewed your work on{" "}
					<span className="font-bold">{title}</span>
				</h3>

				<p className="capitalize text-body text-base break-words">{description}</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						{rating && (
							// @ts-expect-error -- Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.ts(2786)
							<Rating
								initialRating={rating}
								fullSymbol={<Star fill="#15D28E" color="#15D28E" className="mt-[4px]" />}
								emptySymbol={<Star fill="transparent" color="#15D28E" className="mt-[4px]" />}
								readonly
							/>
						)}
					</div>
					<RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
				</div>
			</div>

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
