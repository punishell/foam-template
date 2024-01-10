import { useCallback, useState } from "react";
import { GallerySvg } from "./gallery-svg";
import { useDropzone } from "react-dropzone";
import { useUploadImage } from "@/lib/api/upload";
import Image from "next/image";
import { toast } from "./toaster";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const sizesToPx: { [K in Size]: number } = {
    xs: 54,
    sm: 108,
    md: 142,
    lg: 165,
    xl: 180,
};

const sizesToPositions: { [K in Size]: number } = {
    xs: 2,
    sm: 10,
    md: 24,
    lg: 34,
    xl: 44,
};

interface Props {
    size?: Size;
    image?: string;
    score?: number;
    useUpload?: boolean;
    onUploadComplete?: (response: any) => void;
}

function getAvatarColor(paktScore: number) {
    if (paktScore <= 20) {
        return "bg-red-gradient";
    }
    if (paktScore <= 40) {
        return "bg-yellow-gradient";
    }
    if (paktScore <= 60) {
        return "bg-orange-gradient";
    }
    if (paktScore <= 80) {
        return "bg-blue-gradient ";
    }
    return "bg-green-gradient";
}

const sizes: Record<string, any> = {
    xs: 20,
    md: 30,
};

const getSizes = (size: string) => sizes[size] || 30;

export const UserAvatar: React.FC<Props> = ({ image, score = 0, size = "md" }) => {
    return (
        <div
            className={`${getAvatarColor(
                score,
            )} relative flex h-fit w-fit items-center justify-center rounded-full p-1`}
        >
            <div
                className={`absolute top-[0px] z-10 flex h-8 w-8 items-center justify-center rounded-full p-1 text-white ${getAvatarColor(
                    score,
                )}`}
                style={{
                    right: sizesToPositions[size],
                    width: getSizes(size),
                    height: getSizes(size),
                }}
            >
                {score}
            </div>
            <div
                className="flex items-center justify-center rounded-full bg-white text-white"
                style={{
                    width: sizesToPx[size],
                    height: sizesToPx[size],
                }}
            ></div>
        </div>
    );
};

export const UserAvatar2: React.FC<Props> = ({ image, size = "md", useUpload = false, onUploadComplete }) => {
    const [showUpload, setShowUpload] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const uploadImage = useUploadImage();
    const [imageFile, setImageFile] = useState<{ file: File; preview: string } | null>(null);

    const onEnterLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, value: boolean) => {
        e.preventDefault();
        if (!useUpload) return setShowUpload(false);
        setShowUpload(value);
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setImageFile({
            file,
            preview: URL.createObjectURL(file),
        });
        handleUpload(file);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        noDrag: true,
        accept: {
            "image/*": [],
        },
    });

    const handleUpload = async (file: File) => {
        if (!file) return;
        uploadImage.mutate(
            { file: file, onProgress: setUploadProgress },
            {
                onSuccess: (data) => {
                    toast.success("Avatar uploaded successfully");
                    return onUploadComplete && onUploadComplete(data);
                },
            },
        );
    };

    const h = size === "sm" ? 80 : size === "md" ? 120 : 150;
    const w = size === "sm" ? 80 : size === "md" ? 120 : 150;
    const iconSize = size === "sm" ? 10 : size === "md" ? 30 : 30;

    const PreviewImg = imageFile ? imageFile.preview : image;

    return (
        <div
            className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full border bg-lime-50 text-white duration-200`}
            style={{ height: h, width: w }}
            onMouseEnter={(e) => onEnterLeave(e, true)}
            onMouseLeave={(e) => onEnterLeave(e, false)}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                {PreviewImg ? (
                    <Image src={PreviewImg} alt="profile picture" layout="fill" objectFit="cover" />
                ) : (
                    <span className="visible text-2xl uppercase">HE</span>
                )}
            </div>
            {showUpload && !uploadImage.isLoading && (
                <div
                    className="z-20 flex h-full w-full flex-col items-center justify-center bg-white/30 text-center backdrop-blur-sm"
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <div className="relative flex h-[30px] w-[30px] flex-row">
                        <GallerySvg size={iconSize} />
                    </div>
                    <span className="flex flex-col gap-1 text-xs text-body">
                        <span>
                            <span className="font-bold text-[#23C16B]">Click to upload</span>
                        </span>
                    </span>
                </div>
            )}
            {uploadImage.isLoading && (
                <div className="z-20 flex h-full w-full flex-col items-center justify-center bg-white/30 text-center text-[#23C16B] backdrop-blur-sm">
                    {uploadProgress}%
                </div>
            )}
        </div>
    );
};
