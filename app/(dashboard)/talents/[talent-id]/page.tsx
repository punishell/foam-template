"use client";

import React from "react";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { useGetTalentById, useGetTalentReviewById } from "@/lib/api";
import { useParams } from "next/navigation";
import { Achievements } from "@/components/talents/achievement";
import { Reviews } from "@/components/talents/review";
import { ProfileHeader } from "@/components/talents/header";
import { Bio } from "@/components/talents/bio";

export default function TalentDetails() {
    const params = useParams();
    const talentId = String(params["talent-id"]);
    const talentData = useGetTalentById(talentId, true);
    const reviewData = useGetTalentReviewById(talentId, "1", "10", true);

    if (
        talentData.isLoading ||
        reviewData.isLoading ||
        (!talentData.isFetched && talentData.isFetching) ||
        (!reviewData.isFetched && reviewData.isFetching)
    )
        return <PageLoading />;

    if (talentData.isError || reviewData.isError) return <PageError />;

    const talent = talentData.data.talent;
    const reviews = reviewData.data;

    return (
        <div className="grid h-fit grid-cols-1 items-start gap-6 overflow-y-auto pb-4">
            <ProfileHeader
                _id={talent._id}
                name={`${talent.firstName} ${talent.lastName}`}
                position={talent.profile.bio?.title ?? ""}
                score={talent.score}
                skills={
                    talent?.profile?.talent?.tagsIds?.map((t) => ({ name: t.name, backgroundColor: t.color })) ?? []
                }
                profileImage={talent.profileImage?.url}
            />

            <div className="flex w-full gap-6">
                <Bio body={talent.profile.bio?.description ?? ""} />
                <Achievements
                    achievements={talentData.data.talent.achievements?.map(({ total, type, value }) => ({
                        type,
                        title: type,
                        total: Number(total),
                        value: parseInt(value),
                    }))}
                />
            </div>

            <div className="w-full">
                <Reviews
                    reviews={
                        reviews?.data.map((a) => ({
                            title: a.data.name,
                            body: a.review,
                            rating: a.rating,
                            user: {
                                _id: a.owner._id,
                                afroScore: a.owner.score,
                                name: `${a.owner.firstName}${a.owner.lastName}`,
                                title: a.owner.profile.bio?.title || "",
                                avatar: a.owner.profileImage?.url ?? "",
                            },
                        })) ?? []
                    }
                    loading={false}
                />
            </div>
        </div>
    );
}
