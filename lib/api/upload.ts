import { axios, ApiError, axiosDefault } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/common/toaster";

// upload image
interface UploadImageResponse {
    fileName: string;
    storageUrl: string;
    _id: string;
}

interface UploadImageParams {
    file: File;
    onProgress?: (progress: number) => void;
}

async function postUploadImage({ file, onProgress }: UploadImageParams): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            onProgress?.(percentCompleted);
        },
    });
    return res.data.data;
}

export async function postUploadImages(uploadParams: UploadImageParams[]): Promise<UploadImageResponse[]> {
    const allReqs = [];
    for (let i = 0; i < uploadParams.length; i++) {
        const { file, onProgress } = uploadParams[i];
        allReqs.push(postUploadImage({ file, onProgress }));
    }
    const response = await Promise.all(allReqs);
    return response;
}

async function postDownloadAttachment(url: string): Promise<any> {
    const mainUrl = String(url);
    return fetch(mainUrl, { mode: "no-cors" })
        .then((response) => {
            console.log(response);
            return response.blob();
        })
        .then((blob) => {
            let blobUrl = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.download = url.replace(/^.*[\\\/]/, "");
            a.href = url;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
        });
}

export function useUploadImage() {
    return useMutation({
        mutationFn: postUploadImage,
        mutationKey: ["upload-image"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message || "An error occurred");
        },
    });
}

export function useDownloadAttachment() {
    return useMutation({
        mutationFn: postDownloadAttachment,
        mutationKey: ["download-attachment"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message || "An error occurred");
        },
    });
}
