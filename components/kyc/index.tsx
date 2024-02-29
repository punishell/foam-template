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
			className={`items-start flex-col gap-4 max-sm:py-7 px-4 sm:px-0 ${kyc && profileCompleted ? "hidden" : "flex"}`}
		>
			<h3 className="text-gray-800 text-2xl font-bold leading-[31.20px] tracking-wide sm:hidden">
				Hello {firstName}!
			</h3>
			<div className="flex w-full flex-col sm:flex-row gap-4 sm:gap-0 items-start sm:items-center justify-between rounded-[16px] border border-[#7DDE86] bg-white p-4">
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
