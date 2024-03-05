"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUpdateAccount } from "@/lib/api/account";
import { toast } from "@/components/common/toaster";
import { useUploadImage } from "@/lib/api/upload";
import { useOnboardingState } from "@/lib/store/onboarding";
import { DesktopUploadProfileImage } from "./screens/desktop";
import { MobileProfileImage } from "./screens/mobile";
import { type SlideItemProps } from "@/components/common";

const MB_IN_BYTES = 1024 * 1024;
const maxSize = 2 * MB_IN_BYTES;

export function UploadProfileImage({ goToPreviousSlide }: SlideItemProps): React.JSX.Element {
	const router = useRouter();
	const { skill } = useOnboardingState();
	const uploadImage = useUploadImage();
	const updateAccount = useUpdateAccount();
	const [uploadProgress, setUploadProgress] = useState(0);

	const [imageFile, setImageFile] = useState<{
		file: File;
		preview: string;
	} | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		// if (acceptedFiles.length === 0) return;

		const file = acceptedFiles[0] as File;
		setImageFile({
			file,
			preview: URL.createObjectURL(file),
		});
	}, []);

	const { getRootProps, getInputProps, fileRejections, isDragReject } = useDropzone({
		onDrop,
		maxSize,
		minSize: 0,
		maxFiles: 1,
		accept: {
			"image/png": [],
			"image/jpeg": [],
			"image/jpg": [],
		},
	});

	const isFileTooLarge =
		fileRejections.length > 0 && fileRejections[0]?.file?.size != null && fileRejections[0].file.size > maxSize;

	useEffect(() => {
		return () => {
			if (imageFile != null) {
				URL.revokeObjectURL(imageFile.preview);
			}
		};
	}, [imageFile]);

	const handleUpload = (): void => {
		if (imageFile == null) return;
		uploadImage.mutate(
			{ file: imageFile.file, onProgress: setUploadProgress },
			{
				onSuccess: (data) => {
					// save account details
					const payload = {
						profile: { bio: { title: skill } },
						profileImage: data._id,
					};
					updateAccount.mutate(payload, {
						onSuccess: () => {
							toast.success("Image uploaded successfully");
							router.push("/overview");
						},
					});
				},
			},
		);
	};

	return (
		<>
			<DesktopUploadProfileImage
				handleUpload={handleUpload}
				isFileTooLarge={isFileTooLarge}
				getRootProps={getRootProps}
				getInputProps={getInputProps}
				imageFile={imageFile}
				isDragReject={isDragReject}
				uploadImage={uploadImage}
				updateAccount={updateAccount}
				uploadProgress={uploadProgress}
				goToPreviousSlide={goToPreviousSlide}
			/>
			<MobileProfileImage
				handleUpload={handleUpload}
				isFileTooLarge={isFileTooLarge}
				getRootProps={getRootProps}
				getInputProps={getInputProps}
				imageFile={imageFile}
				isDragReject={isDragReject}
				uploadImage={uploadImage}
				updateAccount={updateAccount}
				uploadProgress={uploadProgress}
				goToPreviousSlide={goToPreviousSlide}
			/>
		</>
	);
}
