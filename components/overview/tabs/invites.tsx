"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetInvites } from "@/lib/api/invites";
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { JobFeedCard } from "../feeds/cards/job/feed";
import { TabContentWrapper } from "./tab-contents-wrapper";

export const Invites = (): ReactElement => {
	const query = useGetInvites({ filter: { status: "pending" } });
	const invites = query.data?.data;

	return (
		<TabContentWrapper>
			{query.isLoading ? (
				<PageLoading className="h-[35vh] 2xl:h-[50vh]" color="#007C5B" />
			) : query.isError ? (
				<PageError className="h-[35vh] 2xl:h-[50vh]" />
			) : invites?.length === 0 ? (
				<PageEmpty className="h-[35vh] 2xl:h-[50vh]" label="Your Invites will appear here" />
			) : (
				invites?.map(({ _id: inviteId, data }) => {
					const { creator, name, _id: jobId, paymentFee } = data;
					// console.log("feed--", inviteId);
					return (
						<JobFeedCard
							id={jobId}
							title={name}
							jobId={jobId}
							key={inviteId}
							type="job-invite-pending"
							inviteId={inviteId}
							amount={String(paymentFee)}
							inviter={{
								_id: creator?._id,
								score: creator?.score,
								avatar: creator?.profileImage?.url,
								name: `${creator?.firstName} ${creator?.lastName}`,
								title: creator?.profile?.bio?.title ?? "",
							}}
							bookmarkId=""
							close={() => {}}
						/>
					);
				})
			)}
		</TabContentWrapper>
	);
};
