"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { useGetAccount } from "@/lib/api/account";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { DesktopClientJobDetails } from "@/components/jobs/desktop-view/view/client-job-details";
import { DesktopTalentJobDetails } from "@/components/jobs/desktop-view/view/talent-job-details";
import { MobileClientJobDetails } from "@/components/jobs/mobile-view/view/client-job-details";
import { MobileTalentJobDetails } from "@/components/jobs/mobile-view/view/talent-job-details";
import { type Job } from "@/lib/types";

interface Props {
    params: {
        "job-id": string;
    };
}

export default function JobDetailsPage({ params }: Props): JSX.Element {
    const jobId = params["job-id"];
    const accountQuery = useGetAccount();
    const jobQuery = useGetJobById({ jobId });

    const tab = useMediaQuery("(min-width: 640px)");
    const isClient = useIsClient();

    const { data: job } = jobQuery;
    const { data: account } = accountQuery;
    const USER_ROLE: "client" | "talent" =
        account?._id === job?.creator._id ? "client" : "talent";

    const VIEWS = {
        client: tab ? DesktopClientJobDetails : MobileClientJobDetails,
        talent: tab ? DesktopTalentJobDetails : MobileTalentJobDetails,
    };

    const CurrentView = VIEWS[USER_ROLE];

    return (
        <div className="h-full w-full">
            {jobQuery.isError || accountQuery.isError ? (
                <PageError className="absolute inset-0" />
            ) : jobQuery.isLoading || accountQuery.isLoading ? (
                <PageLoading className="absolute inset-0" color="#007C5B" />
            ) : (
                isClient && (
                    <CurrentView
                        job={job as Job}
                        userId={account?._id as string}
                    />
                )
            )}
        </div>
    );
}
