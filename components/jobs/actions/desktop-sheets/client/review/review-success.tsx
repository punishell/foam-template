"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Image from "next/image";
import { Button } from "pakt-ui";
import Lottie from "lottie-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import success from "@/lottiefiles/success.json";

export const ReviewSuccess: FC<{ closeModal: () => void }> = ({ closeModal }) => {
	return (
		<div className="flex h-full flex-col items-center justify-center px-4">
			<div className="flex h-fit flex-col items-center justify-center gap-20">
				<div className="">
					<Image src="/images/logo-dark.svg" width={300} height={100} alt="logo" />
				</div>

				<div className="max-w-[200px]">
					<Lottie animationData={success} loop={false} />
				</div>
				<div className="x-mt-40 flex flex-col items-center  gap-9 text-center">
					<div className="flex flex-col items-center gap-9 text-center">
						<p className="max-w-[80%] text-lg text-body">
							Your review has been submitted. Payment will be released after talent has submitted their
							review.
						</p>
						<div className="w-full max-w-[200px]">
							<Button fullWidth size="sm" onClick={closeModal}>
								Done
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
