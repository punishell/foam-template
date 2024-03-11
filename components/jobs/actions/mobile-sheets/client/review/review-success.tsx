"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import success from "@/lottiefiles/success-mobile.json";
import { Breadcrumb } from "@/components/common/breadcrumb";

export const ReviewSuccess = ({ closeModal }: { closeModal: () => void }): JSX.Element => {
	const router = useRouter();
	return (
		<>
			<Breadcrumb
				items={[
					{
						label: "Jobs",
						action: () => {
							router.push("/jobs?skills=&search=&range=%2C100&jobs-type=created");
						},
					},
					{
						label: "Create Job",
						active: true,
						action: () => {
							router.push("/jobs/create");
						},
					},
				]}
			/>
			<div className="flex h-full flex-col items-center justify-center px-4">
				<div className="flex h-fit flex-col items-center justify-center gap-20">
					<div className="">
						<Image src="/images/logo-dark.svg" width={300} height={100} alt="logo" />
					</div>

					<div className="max-w-[200px]">
						<Lottie animationData={success} loop />
					</div>
					<div className="x-mt-40 flex flex-col items-center  gap-9 text-center">
						<div className="flex flex-col items-center gap-9 text-center">
							<p className="max-w-[80%] text-lg text-body">
								Your review has been submitted. Payment will be released after talent has submitted
								their review.
							</p>

							<Button
								fullWidth
								size="lg"
								onClick={(e) => {
									e.stopPropagation();
									closeModal();
								}}
								variant="primary"
								className="w-full max-w-[200px] cursor-pointer"
							>
								Go to Dashboard
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
