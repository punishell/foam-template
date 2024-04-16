"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { useGetTalentById, useGetTalentReviewById } from "@/lib/api";
import { Achievements } from "@/components/talent/profile/achievements";
import { Reviews } from "@/components/talent/profile/reviews";
import { ProfileHeader } from "@/components/talent/profile/header";
import { Bio } from "@/components/talent/profile/bio";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { MobileProfileHeader } from "@/components/talent/profile/mobile-header";

export default function TalentDetailsPage(): ReactElement {
    const params = useParams();
    const router = useRouter();
    const talentId = String(params["talent-id"]);
    const talentData = useGetTalentById(talentId, true);
    const reviewData = useGetTalentReviewById(talentId, "1", "20", true);
    const tab = useMediaQuery("(min-width: 640px)");

    if (
        talentData.isLoading ||
        reviewData.isLoading ||
        (!talentData.isFetched && talentData.isFetching) ||
        (!reviewData.isFetched && reviewData.isFetching)
    )
        return <PageLoading color="#007C5B" />;

    if (talentData.isError || reviewData.isError) return <PageError />;

    const { talent } = talentData.data;
    const reviews = reviewData.data ?? [];

    return (
        <>
            <Breadcrumb
                items={[
                    {
                        label: "Talents",
                        action: () => {
                            router.push(
                                "/talents?skills=&search=&range=0%2C100"
                            );
                        },
                    },
                    { label: "Talent Details", active: true },
                ]}
            />

            <div className="flex h-full flex-col items-start overflow-y-auto sm:grid sm:h-fit sm:grid-cols-1 sm:gap-6 sm:pb-4">
                {tab ? (
                    <ProfileHeader
                        _id={talent._id}
                        name={`${talent.firstName} ${talent.lastName}`}
                        position={talent.profile?.bio?.title ?? ""}
                        score={talent.score as number}
                        skills={
                            talent?.profile?.talent?.tagsIds?.map((t) => ({
                                name: t.name,
                                backgroundColor: t.color,
                            })) ?? []
                        }
                        profileImage={talent.profileImage?.url}
                    />
                ) : (
                    <MobileProfileHeader
                        _id={talent._id}
                        name={`${talent.firstName} ${talent.lastName}`}
                        position={talent.profile?.bio?.title ?? ""}
                        score={talent.score as number}
                        skills={
                            talent?.profile?.talent?.tagsIds?.map((t) => ({
                                name: t.name,
                                backgroundColor: t.color,
                            })) ?? []
                        }
                        profileImage={talent.profileImage?.url}
                    />
                )}
                <div className="flex w-full flex-col sm:flex-row sm:gap-6">
                    <Bio body={talent.profile?.bio?.description ?? ""} />
                    <Achievements
                        achievements={talentData.data.talent.achievements?.map(
                            ({ total, type, value }) => ({
                                type,
                                title: type,
                                total: Number(total),
                                value: parseInt(value, 10),
                            })
                        )}
                    />
                </div>

                <div className="h-auto w-full">
                    <Reviews
                        reviews={
                            reviews?.data
                                .slice()
                                .reverse()
                                .map((a) => ({
                                    title: a.data.name,
                                    body: a.review,
                                    rating: a.rating,
                                    date: a.createdAt ?? "",
                                    user: {
                                        _id: a.owner._id,
                                        afroScore: a.owner.score,
                                        name: `${a.owner.firstName}${a.owner.lastName}`,
                                        title:
                                            a.owner.profile?.bio?.title ?? "",
                                        avatar: a.owner.profileImage?.url ?? "",
                                    },
                                })) ?? []
                        }
                        loading={false}
                    />
                </div>
            </div>
        </>
    );
}
