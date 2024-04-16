"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetTalentReviewById } from "@/lib/api";
import { Achievements } from "@/components/talent/profile/achievements";
import { Reviews } from "@/components/talent/profile/reviews";
import { useUserState } from "@/lib/store/account";
import { ProfileHeader } from "@/components/talent/profile/header";
import { Bio } from "@/components/talent/profile/bio";
import { PageLoading } from "@/components/common/page-loading";
import { MobileProfileHeader } from "@/components/talent/profile/mobile-header";

export default function ProfilePage(): ReactElement | null {
	const router = useRouter();
	const user = useUserState();
	const talentId = String(user?._id);
	const { data: talentReviews, isLoading, refetch: FetchTalent } = useGetTalentReviewById(talentId, "1", "20", true);
	const tab = useMediaQuery("(min-width: 640px)");

	useEffect(() => {
		if (talentId) {
			void FetchTalent();
		} else router.back();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const talent = useMemo(
		() => ({
			id: user?._id,
			name: `${user?.firstName} ${user?.lastName}`,
			position: user?.profile?.bio?.title ?? "",
			image: user?.profileImage?.url ?? "",
			bio: user?.profile?.bio?.description ?? "",
			score: user?.score ?? 0,
			achievements: (user?.achievements ?? []).map((a) => ({
				title: a.type,
				type: a.type,
				total: Number(a.total),
				value: Number(a.value),
			})),
			skills:
				(user?.profile?.talent?.tagsIds ?? []).map((t) => ({
					name: t.name,
					backgroundColor: t.color,
				})) || [],
		}),
		[user],
	);

	if (isLoading) return <PageLoading color="#007C5B" />;
	const reviews = talentReviews?.data ?? [];

	return (
		<div className="flex flex-col sm:grid h-full sm:h-fit sm:grid-cols-1 items-start sm:gap-6 overflow-y-auto sm:pb-4 sm-max:bg-white">
			{tab ? (
				<ProfileHeader
					_id={talent.id}
					name={talent.name}
					position={talent.position}
					score={talent.score}
					skills={talent.skills}
					isOwnProfile
					profileImage={talent.image}
				/>
			) : (
				<MobileProfileHeader
					_id={talent.id}
					name={talent.name}
					position={talent.position}
					score={talent.score}
					skills={talent.skills}
					isOwnProfile
					profileImage={talent.image}
				/>
			)}

			<div className="flex w-full sm:gap-6 sm:flex-row flex-col">
				<Bio body={talent.bio} />
				<Achievements
					achievements={talent.achievements?.map(({ total, type, value }) => ({
						type,
						title: type,
						total: Number(total),
						value: parseInt(String(value), 10),
					}))}
				/>
			</div>
			<div className="w-full h-auto">
				<Reviews
					reviews={
						reviews
							?.slice()
							.reverse()
							.map((a) => ({
								title: a.data.name,
								body: a.review,
								rating: a.rating,
								date: a.createdAt ?? "",
								user: {
									_id: a.owner._id ?? "",
									afroScore: a.owner.score,
									name: `${a.owner.firstName}${a.owner.lastName}`,
									title: a.owner.profile?.bio?.title ?? "",
									avatar: a.owner.profileImage?.url ?? "",
								},
							})) ?? []
					}
					loading={isLoading}
				/>
			</div>
		</div>
	);
}
