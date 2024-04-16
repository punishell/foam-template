"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useState, type ReactElement } from "react";
import { Button } from "pakt-ui";
import { Briefcase, Star } from "lucide-react";
import Rating from "react-rating";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { RenderBookMark } from "@/components/jobs/misc/render-bookmark";
import { AfroProfile } from "@/components/common/afro-profile";
import { SideModal } from "@/components/common/side-modal";
import { useHeaderScroll } from "@/lib/store";
import { MobileSheetWrapper } from "@/components/common/mobile-sheet-wrapper";
import { titleCase } from "@/lib/utils";

import { ClientJobModal } from "@/components/jobs/actions/desktop-sheets/client";
import { TalentJobModal } from "@/components/jobs/actions/desktop-sheets/talent";

import { TalentJobSheetForMobile } from "@/components/jobs/actions/mobile-sheets/talent";
import { ClientJobModalForMobile } from "@/components/jobs/actions/mobile-sheets/client";

interface ReviewChangeProps {
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
	isAccepted: boolean;
	isCreator: boolean;
	rating?: number;
	// close?: (id: string) => void;
}
export const ReviewChangeCard = ({
	id,
	title,
	jobId,
	description,
	creator,
	talent,
	bookmarked,
	bookmarkId,
	isCreator,
	isAccepted,
	rating,
	// close,
}: ReviewChangeProps): ReactElement => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
	const { setScrollPosition } = useHeaderScroll();

	const tab = useMediaQuery("(min-width: 640px)");

	return tab ? (
		<div className="relative z-10 flex h-[174px] w-full gap-4 overflow-hidden rounded-2xl border border-[#FF5247] bg-[#FFF4F4] p-4">
			<AfroProfile
				src={isCreator ? talent.avatar : creator.avatar}
				score={isCreator ? talent.score : creator.score}
				size="lg"
				url={`/talents/${isCreator ? talent._id : creator._id}`}
			/>
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-title">{title}</h3>
				</div>

				<p className="text-body">{description}</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						{!isAccepted && (
							<Button
								size="xs"
								variant="outline"
								onClick={() => {
									setIsModalOpen(true);
								}}
							>
								View Request
							</Button>
						)}
						{rating && (
							// @ts-expect-error --- 'Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.
							<Rating
								initialRating={rating}
								fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
								emptySymbol={<Star fill="transparent" color="#15D28E" />}
								readonly
							/>
						)}
					</div>
					<RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
				</div>
			</div>

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Briefcase size={200} color="#FFE5E5" />
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
			role="button"
			tabIndex={0}
			onClick={() => {
				setScrollPosition(1);
				setIsMobileModalOpen(true);
			}}
			onKeyDown={() => {
				setIsMobileModalOpen(true);
			}}
			className="cursor-pointer z-10 flex flex-col w-full gap-4 overflow-hidden border-b border-[#FF5247] bg-[#FFF4F4] px-[21px] py-4"
		>
			<div className="flex items-center gap-2 relative -left-[5px]">
				<AfroProfile
					src={isCreator ? talent.avatar : creator.avatar}
					score={isCreator ? talent.score : creator.score}
					size="sm"
					url={`/talents/${isCreator ? talent._id : creator._id}`}
				/>
				<div className="flex-col justify-start items-start inline-flex">
					<p className="text-gray-800 text-lg flex leading-[27px] tracking-wide">
						{isCreator ? talent.name : creator.name}
					</p>
					<span className="text-gray-500 text-xs leading-[18px] tracking-wide">
						{titleCase(isCreator ? talent.title : creator.title)}
					</span>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-bold text-title">{title}</h3>
				</div>

				<p className="capitalize text-body text-base">{description}</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						{rating && (
							// @ts-expect-error --- 'Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.
							<Rating
								initialRating={rating}
								fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
								emptySymbol={<Star fill="transparent" color="#15D28E" />}
								readonly
							/>
						)}
					</div>
					<RenderBookMark size={20} isBookmarked={bookmarked} type="feed" id={id} bookmarkId={bookmarkId} />
				</div>
			</div>
			<MobileSheetWrapper isOpen={isMobileModalOpen}>
				{isCreator ? (
					<ClientJobModalForMobile
						jobId={jobId}
						talentId={talent._id}
						closeModal={() => {
							setScrollPosition(0);
							setIsModalOpen(false);
						}}
						extras={id}
					/>
				) : (
					<TalentJobSheetForMobile
						jobId={jobId}
						talentId={talent._id}
						closeModal={() => {
							setScrollPosition(0);
							setIsModalOpen(false);
						}}
						extras={id}
					/>
				)}
			</MobileSheetWrapper>
		</div>
	);
};
