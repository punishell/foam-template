import { axios, ApiError } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/common/toaster';

// upload image

interface UploadImageResponse {
  fileName: string;
  storageUrl: string;
}

interface UploadImageParams {
  file: File;
  onProgress?: (progress: number) => void;
}

async function postUploadImage({ file, onProgress }: UploadImageParams): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      onProgress?.(percentCompleted);
    },
  });
  return res.data.data;
}

export function useUploadImage() {
  return useMutation({
    mutationFn: postUploadImage,
    mutationKey: ['upload-image'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}
