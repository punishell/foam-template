"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { format } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type { UserProfile } from "@/lib/types";
import { AfroProfile } from "@/components/common/afro-profile";
import { rubik } from "@/app/font";

interface Props {
	status?: "ongoing" | "cancel_requested";
	createdAt: string;
	deliveryDate: string;
	paymentFee: number;
	profile: UserProfile;
	tags: Array<{
		color: string;
		name: string;
	}>;
}

export const JobUpdateHeader: FC<Props> = ({
	createdAt,
	profile,
	deliveryDate,
	paymentFee,
	tags,
	status = "ongoing",
}) => {
	return (
		<div className="flex flex-col">
			<div
				className="grid grid-cols-4 divide-x border-b p-4"
				style={{
					borderColor: status === "cancel_requested" ? "#FFBDBD" : "#7DDE86",
					backgroundColor: status === "cancel_requested" ? "#FFF8F8" : "#F8FFF4",
				}}
			>
				<div className="flex flex-col gap-2">
					<span className="text-body text-sm">Date Created</span>
					<span className="text-black text-base">{format(new Date(createdAt), "dd/MM/yyyy")}</span>
				</div>
				<div className="flex flex-col gap-2 px-2">
					<span className="text-body text-sm">Due Date</span>
					<span className="text-black text-base">{format(new Date(deliveryDate), "dd/MM/yyyy")}</span>
				</div>

				<div className="flex flex-col gap-2 px-2">
					<span className="text-body text-sm">Price</span>
					<span className="text-black">${paymentFee}</span>
				</div>
				<div className="flex flex-col gap-2 pl-2">
					<span className="text-body text-sm">Status</span>

					<p
						className={`flex items-center justify-center text-center rounded-full p-1 text-[10.50px] text-white tracking-wide leading-none ${rubik.className}`}
						style={{
							borderColor: status === "cancel_requested" ? "#FFBDBD" : "#7DDE86",
							backgroundColor: status === "cancel_requested" ? "#EE4B2B" : "#7DDE86",
						}}
					>
						{status === "cancel_requested" ? "Cancelling" : "In Progress"}
					</p>
				</div>
			</div>

			<div
				className="flex flex-col divide-y p-4 border-b"
				style={{
					borderColor: status === "cancel_requested" ? "#FFBDBD" : "#7DDE86",
					backgroundColor: status === "cancel_requested" ? "#FFF8F8" : "#F8FFF4",
				}}
			>
				<div className="flex flex-col gap-2 pb-1">
					<div className="flex items-center gap-2">
						<AfroProfile
							score={profile?.score || 0}
							size="sm"
							src={profile.profileImage?.url}
							url={`/talents/${profile?._id}`}
							className="relative -left-1"
						/>
						<div className="flex flex-col">
							<span className="text-lg font-bold text-title">
								{`${profile.firstName} ${profile.lastName}`}
							</span>
							<span className="text-sm capitalize">{profile.profile.bio.title}</span>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2 pt-4">
					<span className="text-body">Skills:</span>
					<div className="flex items-center gap-2 text-sm">
						{tags.map(({ color, name }) => {
							return (
								<span
									key={name}
									className="rounded-full px-4 py-0.5 capitalize"
									style={{
										backgroundColor: color,
									}}
								>
									{name}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
