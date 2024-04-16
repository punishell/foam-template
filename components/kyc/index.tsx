"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { MESSAGES, createVeriffFrame } from "@veriff/incontext-sdk";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "pakt-ui";
import { useCreateKycSession } from "@/lib/api/kyc";
import { useUserState } from "@/lib/store/account";

const Kyc = (): JSX.Element => {
    const createSession = useCreateKycSession();
    const { kyc, profileCompleteness, firstName } = useUserState();
    const value = profileCompleteness ?? 0;
    const profileCompleted = value > 70;

    const handleCreateSession = (): void => {
        createSession.mutate("", {
            onSuccess: (data) => {
                const url = data?.verification?.url;
                createVeriffFrame({
                    url,
                    onEvent: (msg) => {
                        switch (msg) {
                            case MESSAGES.CANCELED:
                                break;
                            default:
                                break;
                        }
                    },
                });
            },
        });
    };
    return (
        <div
            className={`flex-col items-start gap-4 px-4 sm:px-0 max-sm:py-7 ${kyc && profileCompleted ? "hidden" : "flex"}`}
        >
            <h3 className="text-2xl font-bold leading-[31.20px] tracking-wide text-gray-800 sm:hidden">
                Hello {firstName}!
            </h3>
            <div className="flex w-full flex-col items-start justify-between gap-4 rounded-[16px] border border-[#7DDE86] bg-white p-4 sm:flex-row sm:items-center sm:gap-0">
                <p className="text-base font-normal text-[#6c757d]">
                    KYC is required before performing job creation and wallet
                    withdrawals.
                </p>
                <Button
                    variant="secondary"
                    size="sm"
                    className="bg-transparent max-sm:!px-4 max-sm:!py-2 max-sm:!text-sm"
                    onClick={() => {
                        handleCreateSession();
                    }}
                >
                    Setup KYC
                </Button>
            </div>
        </div>
    );
};

export default Kyc;
