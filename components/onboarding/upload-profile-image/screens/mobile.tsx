"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { Edit3, AlertCircle, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { GallerySvg } from "@/components/common/gallery-svg";
import { FloatingAvatars } from "../misc/floating-avatars";
import { type UPIProps } from "../types";
import { UploadProgress } from "../misc/upload-progress";

export function MobileProfileImage({
	getRootProps,
	getInputProps,
	imageFile,
	isFileTooLarge,
	isDragReject,
	uploadImage,
	updateAccount,
	handleUpload,
	uploadProgress,
	goToPreviousSlide,
}: UPIProps): React.JSX.Element {
	const router = useRouter();
	return (
		<div className="relative flex sm:hidden w-full shrink-0 flex-col items-center gap-4 max-h-auto">
			<div className="flex items-center justify-between w-full relative">
				<Button
					size="sm"
					className="!border-white"
					onClick={goToPreviousSlide}
					variant="outline"
				>
					<ChevronLeft className="text-white" />
				</Button>
				<span className="text-xl font-bold text-white">
					Create Your Avatar
				</span>
				<Button
					className="!text-white !px-0 !mx-0 !text-lg !font-normal"
					type="button"
					size="lg"
					onClick={() => {
						router.push("/overview");
					}}
				>
					Skip
				</Button>
			</div>
			<div className="relative flex sm:hidden w-full shrink-0 flex-col justify-center bg-white items-center gap-4 h-[539px] rounded-2xl">
				<FloatingAvatars />

				<div
					className="group relative flex h-[270px] w-[270px] cursor-pointer items-center justify-center overflow-hidden rounded-full border bg-[#ECFCE5] duration-200 hover:bg-lime-50"
					{...getRootProps()}
				>
					<input {...getInputProps()} />
					<div className="flex flex-col items-center gap-2 text-center ">
						<GallerySvg />
						<span className="flex flex-col gap-1 text-body">
							<span>
								<span className="text-[#23C16B]">Click</span>
								<span> or drag and drop</span>
							</span>
							<span> to upload</span>
						</span>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						{imageFile != null && (
							<Image
								src={imageFile.preview}
								alt="profile picture"
								layout="fill"
								objectFit="cover"
							/>
						)}
					</div>

					{imageFile != null && (
						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
							<div className="mt-10 flex items-center gap-2 rounded-sm border border-primary bg-green-200 px-2 py-1 text-primary opacity-0 duration-200 group-hover:opacity-100">
								<Edit3 size={24} />
								<span className="text-sm">Change Image</span>
							</div>
						</div>
					)}
				</div>

				{isFileTooLarge && (
					<div className="flex items-center gap-1 text-sm text-red-500">
						<AlertCircle size={16} />
						<span>File size should be less than 2MB</span>
					</div>
				)}

				{isDragReject && (
					<div className="flex items-center gap-1 text-sm text-red-500">
						<AlertCircle size={16} />
						<span>File type not supported</span>
					</div>
				)}
			</div>
			<div className="flex h-[80px] w-full items-center justify-center">
				{uploadImage.isLoading || updateAccount.isLoading ? (
					<UploadProgress progress={uploadProgress} />
				) : (
					<div className="w-full max-w-xs">
						<Button
							size="lg"
							fullWidth
							disabled={imageFile == null || isFileTooLarge}
							onClick={handleUpload}
							variant="primary"
						>
							Upload Image
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
