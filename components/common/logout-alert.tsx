"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatDistance } from "date-fns";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "./button";
import { Modal } from "./headless-modal";
import { emptyFunction } from "@/lib/utils";

interface LogoutAlertProps {
	isTimeoutModalOpen: boolean;
	remainingTime: number;
	stayActive: () => void;
	Logout: () => void;
}

export const LogoutAlert = ({
	isTimeoutModalOpen,
	remainingTime,
	stayActive,
	Logout,
}: LogoutAlertProps): JSX.Element => {
	return (
		<Modal
			isOpen={isTimeoutModalOpen}
			closeModal={() => {
				emptyFunction();
			}}
			disableClickOutside
		>
			<div className="flex w-full flex-col items-center gap-4 rounded-xl bg-white p-4 py-4 text-center">
				<h2 className="text-2xl font-bold">Session Expiring</h2>
				<p>
					Logging out{" "}
					<span className="">
						{formatDistance(remainingTime, 0, {
							includeSeconds: true,
							addSuffix: true,
						})}
					</span>
				</p>

				<div className="flex w-full items-center gap-1">
					<Button size="lg" fullWidth variant="secondary" onClick={Logout}>
						Log Out
					</Button>
					<Button size="lg" fullWidth variant="primary" onClick={stayActive}>
						Stay Active
					</Button>
				</div>
			</div>
		</Modal>
	);
};
