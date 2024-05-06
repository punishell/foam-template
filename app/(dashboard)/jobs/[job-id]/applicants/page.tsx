"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { useMediaQuery, useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetJobById } from "@/lib/api/job";
import { useGetAccount } from "@/lib/api/account";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { DesktopApplicantView } from "@/components/jobs/desktop-view/applicant";
import { MobileApplicantView } from "@/components/jobs/mobile-view/applicant";

interface Props {
    params: {
        "job-id": string;
    };
}

export default function JobApplications({ params }: Props): JSX.Element {
    const jobId = params["job-id"];
    const accountData = useGetAccount();
    const jobData = useGetJobById({ jobId });

    const tab = useMediaQuery("(min-width: 640px)");
    const isClient = useIsClient();

    if (jobData.isError) return <PageError className="absolute inset-0" />;
    if (jobData.isLoading)
        return <PageLoading className="absolute inset-0" color="#007C5B" />;

    const { data: job } = jobData;
    const { data: account } = accountData;

    return (
        isClient &&
        (tab ? (
            <DesktopApplicantView job={job} account={account} />
        ) : (
            <MobileApplicantView job={job} account={account} />
        ))
    );
}
