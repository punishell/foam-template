/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type DropzoneInputProps,
	type DropzoneRootProps,
} from "react-dropzone";
import { type UseMutationResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError } from "@/lib/axios";
import { type User } from "@/lib/types";
import { type UpdateAccountParams } from "@/lib/api/account";

import {
	type UploadImageParams,
	type UploadImageResponse,
} from "@/lib/api/upload";

export interface UPIProps {
	getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
	getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
	imageFile: {
		file: File;
		preview: string;
	} | null;
	isFileTooLarge: boolean;
	isDragReject: boolean;
	uploadImage: UseMutationResult<
		UploadImageResponse,
		ApiError,
		UploadImageParams,
		unknown
	>;
	updateAccount: UseMutationResult<
		User,
		ApiError,
		UpdateAccountParams,
		unknown
	>;
	handleUpload: () => void;
	uploadProgress: number;
	goToPreviousSlide: () => void;
}
