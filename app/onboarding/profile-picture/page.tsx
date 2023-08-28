'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from 'pakt-ui';
import { Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useUploadImage } from '@/lib/api/upload';
import { toast } from '@/components/common/toaster';

export default function ProfilePic() {
  const router = useRouter();
  const uploadImage = useUploadImage();
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const [imageFile, setImageFile] = React.useState<{
    file: File;
    preview: string;
  } | null>(null);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImageFile({
      file,
      preview: URL.createObjectURL(file),
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/*': [],
    },
  });

  React.useEffect(() => {
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(imageFile.preview);
      }
    };
  }, [imageFile]);

  const handleUpload = async () => {
    if (!imageFile) return;
    uploadImage.mutate(
      { file: imageFile.file, onProgress: setUploadProgress },
      {
        onSuccess: () => {
          toast.success('Image uploaded successfully');
          router.push('/overview');
        },
      },
    );
  };

  return (
    <div className="flex gap-4 flex-col items-center">
      <div className="flex flex-col items-center text-body">
        <p className="text-lg">Last Step</p>
        <span className="text-2xl font-bold text-title">Create Your Avatar</span>
        <span className="text-base text-[#6c757d]">Upload an Image</span>
      </div>

      <div
        className="relative flex items-center justify-center border overflow-hidden rounded-full h-[270px] w-[270px] bg-[#ECFCE5] hover:bg-lime-50 duration-200 cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col gap-2 text-center items-center ">
          <GallerySvg />
          <span className="text-body flex flex-col gap-1">
            <span>
              <span className="text-[#23C16B]">Click</span>
              <span> or drag and drop</span>
            </span>
            <span> to upload</span>
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          {imageFile && <Image src={imageFile.preview} alt="profile picture" layout="fill" objectFit="cover" />}
        </div>

        {imageFile && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-green-200 text-primary border border-primary px-2 py-1 rounded-sm mt-10">
              <Edit3 size={24} />
              <span className="text-sm">Change Image</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-[80px] w-full flex items-center justify-center">
        {uploadImage.isLoading ? (
          <UploadProgress progress={uploadProgress} />
        ) : (
          <div className="max-w-xs w-full">
            <Button size="sm" fullWidth disabled={!imageFile} onClick={handleUpload}>
              Upload Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface UploadProgressProps {
  progress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="flex flex-col w-full max-w-sm bg-[#ECFCE533] p-4 rounded-2xl gap-2 border border-[#7DDE86]">
      <span className="text-sm">Uploading</span>
      <div className="w-full h-[8px] rounded-full overflow-hidden bg-[#EBEFF2]">
        <div
          className="h-full bg-primary-gradient rounded-full"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

const GallerySvg = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.278 12.222C14.4676 12.222 13.6904 12.5439 13.1174 13.1169C12.5444 13.6899 12.2224 14.4671 12.2224 15.2775V58.0553C12.2224 58.8657 12.5444 59.6429 13.1174 60.2159C13.6904 60.7889 14.4676 61.1108 15.278 61.1108H58.0558C58.8662 61.1108 59.6433 60.7889 60.2164 60.2159C60.7894 59.6429 61.1113 58.8657 61.1113 58.0553V33.6108C61.1113 31.9233 62.4794 30.5553 64.1669 30.5553C65.8544 30.5553 67.2224 31.9233 67.2224 33.6108V58.0553C67.2224 60.4864 66.2567 62.818 64.5376 64.5371C62.8185 66.2562 60.4869 67.222 58.0558 67.222H15.278C12.8468 67.222 10.5153 66.2562 8.79618 64.5371C7.0771 62.818 6.11133 60.4864 6.11133 58.0553V15.2775C6.11133 12.8464 7.0771 10.5148 8.79618 8.79569C10.5153 7.07661 12.8468 6.11084 15.278 6.11084H39.7224C41.41 6.11084 42.778 7.47886 42.778 9.1664C42.778 10.8539 41.41 12.222 39.7224 12.222H15.278Z"
        fill="#23C16B"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.5704 20.5699C22.003 19.1373 23.9459 18.3325 25.9719 18.3325C27.9979 18.3325 29.9408 19.1373 31.3734 20.5699C32.806 22.0025 33.6108 23.9455 33.6108 25.9714C33.6108 27.9974 32.806 29.9403 31.3734 31.3729C29.9408 32.8055 27.9979 33.6103 25.9719 33.6103C23.9459 33.6103 22.003 32.8055 20.5704 31.3729C19.1378 29.9403 18.333 27.9974 18.333 25.9714C18.333 23.9455 19.1378 22.0025 20.5704 20.5699ZM25.9719 24.4436C25.5667 24.4436 25.1781 24.6046 24.8916 24.8911C24.6051 25.1776 24.4441 25.5662 24.4441 25.9714C24.4441 26.3766 24.6051 26.7652 24.8916 27.0517C25.1781 27.3382 25.5667 27.4992 25.9719 27.4992C26.3771 27.4992 26.7657 27.3382 27.0522 27.0517C27.3387 26.7652 27.4997 26.3766 27.4997 25.9714C27.4997 25.5662 27.3387 25.1776 27.0522 24.8911C26.7657 24.6046 26.3771 24.4436 25.9719 24.4436Z"
        fill="#198155"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M46.7277 28.3954C47.921 27.2022 49.8557 27.2022 51.049 28.3954L66.3267 43.6732C67.52 44.8665 67.52 46.8012 66.3267 47.9944C65.1335 49.1877 63.1988 49.1877 62.0055 47.9944L48.8884 34.8773L17.4378 66.3278C16.2446 67.521 14.3099 67.521 13.1166 66.3278C11.9234 65.1345 11.9234 63.1998 13.1166 62.0066L46.7277 28.3954Z"
        fill="#198155"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M58.0565 3.05566C59.7441 3.05566 61.1121 4.42368 61.1121 6.11122V24.4446C61.1121 26.1321 59.7441 27.5001 58.0565 27.5001C56.369 27.5001 55.001 26.1321 55.001 24.4446V6.11122C55.001 4.42368 56.369 3.05566 58.0565 3.05566Z"
        fill="#198155"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M45.833 15.2772C45.833 13.5897 47.201 12.2217 48.8886 12.2217H67.2219C68.9094 12.2217 70.2775 13.5897 70.2775 15.2772C70.2775 16.9648 68.9094 18.3328 67.2219 18.3328H48.8886C47.201 18.3328 45.833 16.9648 45.833 15.2772Z"
        fill="#198155"
      />
    </svg>
  );
};
