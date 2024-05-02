"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type Job } from "@/lib/types";
import { UnAssignedJobCard } from "./card";
import { PageEmpty } from "@/components/common/page-empty";

interface UnassignedJobsProps {
    jobs: Job[];
}

export const UnassignedJobs = ({ jobs }: UnassignedJobsProps): JSX.Element => {
    return (
        <div className="flex h-full w-full flex-col overflow-y-scroll">
            {!jobs.length ? (
                <PageEmpty label="No open jobs yet." className="" />
            ) : (
                jobs.map((job) => {
                    return <UnAssignedJobCard job={job} key={job._id} />;
                })
            )}
        </div>
    );
};
