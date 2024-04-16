"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { colorFromScore, limitString, titleCase } from "@/lib/utils";
import { AfroProfile } from "@/components/common/afro-profile";

interface TalentBoxProps {
	id: string;
	name: string;
	title: string;
	imageUrl?: string;
	score?: string;
	skills: Array<{ name: string; color: string }>;
}

export const TalentCard = ({ id, name, title, imageUrl, score, skills }: TalentBoxProps): JSX.Element => {
	const colorCodes = colorFromScore(parseInt(score ?? "0", 10));

	return (
		<Link
			key={id}
			className="m-0 h-[125.50px] p-0 w-full"
			style={{
				background: colorCodes.bgColor,
				borderBottom: `1px solid ${colorCodes.borderColor}`,
			}}
			href={`/talents/${id}`}
		>
			<div className="w-full px-[21px] py-4 justify-start items-start inline-flex">
				<AfroProfile
					size="2sm"
					score={Math.round(Number(score))}
					src={imageUrl}
					url={`/talents/${id}`}
					className="relative -left-[10px]"
				/>
				<div className="w-full flex-col justify-start items-start gap-4 inline-flex">
					<div className="flex-col justify-start items-start gap-[2.58px] flex">
						<h4 className="self-stretch text-black text-lg font-bold leading-[27px] tracking-wide">
							{name}
						</h4>
						<p className="text-black text-base leading-normal tracking-tight">{titleCase(title)}</p>
					</div>
					<div className="justify-start items-center gap-1 flex">
						{skills?.length > 0 && (
							<div className="flex w-full items-center gap-2">
								{skills?.slice(0, 3).map(
									(
										skill: {
											name: string;
											color: string;
										},
										i: number,
									) => {
										const { color, name: n } = skill;
										const s = n || skill;
										return (
											<span
												key={i}
												className="shrink-0 grow items-center gap-2 rounded-3xl px-3 py-1 text-center capitalize text-xs"
												style={{
													backgroundColor: color ?? "#B2AAE9",
												}}
											>
												{limitString(s as string)}
											</span>
										);
									},
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
};
