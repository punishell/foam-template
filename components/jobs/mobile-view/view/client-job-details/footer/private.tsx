"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useRouter } from "next/navigation";
import { Button } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

export interface ClientPrivateJobCtasProps {
    jobId: string;
    openDeleteModal: () => void;
    skills?: string[];
}

export const ClientPrivateJobCtas: React.FC<ClientPrivateJobCtasProps> = ({
    jobId,
    skills = [],
    openDeleteModal,
}) => {
    const router = useRouter();

    return (
        <div className="mt-auto flex w-full flex-col items-center gap-4">
            <Button
                fullWidth
                onClick={() => {
                    router.push(
                        `/talents${skills != null && skills?.length > 0 ? `?skills=${skills?.join(",")}` : ""}`
                    );
                }}
            >
                Find Talent
            </Button>

            <div className="flex w-full items-center gap-2">
                <Button
                    fullWidth
                    variant="danger"
                    onClick={openDeleteModal}
                    size="sm"
                    className="!border !border-red-400"
                >
                    Delete Job
                </Button>

                <Button
                    fullWidth
                    variant="outline"
                    onClick={() => {
                        router.push(`/jobs/${jobId}/edit`);
                    }}
                >
                    Edit Job
                </Button>
            </div>
        </div>
    );
};
