"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Button } from "pakt-ui";
import { useRouter } from "next/navigation";
import { type LucideIcon, PenTool, Terminal, Users, Feather, Library, Volume2, Edit3, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Slider, type SlideItemProps } from "@/components/common";
import { useUpdateAccount } from "@/lib/api/account";
import { toast } from "@/components/common/toaster";
import { useUploadImage } from "@/lib/api/upload";
import { useOnboardingState } from "@/lib/store/onboarding";
import { GallerySvg } from "@/components/common/gallery-svg";
import { useUserState } from "@/lib/store/account";

interface SkillCardProps {
    label: string;
    Icon: LucideIcon;
    isActive: boolean;
    toggleSelection: () => void;
}

function SkillCard({ label, Icon, isActive, toggleSelection }: SkillCardProps): React.JSX.Element {
    return (
        <button
            onClick={toggleSelection}
            className={clsx(
                "flex min-w-[200px] flex-col items-start gap-4 rounded-lg border p-6 text-title duration-200 hover:bg-gray-100",
                {
                    "border-[#E8E8E8] bg-[#FCFCFC]": !isActive,
                    "border-[#007C5B] bg-[#007C5B1A]": isActive,
                },
            )}
            type="button"
        >
            <Icon size={32} />
            <span className="text-2xl">{label}</span>
        </button>
    );
}

const SKILLS = [
    { label: "Design", value: "design", Icon: PenTool },
    { label: "Engineering", value: "engineering", Icon: Terminal },
    { label: "Product", value: "product", Icon: Library },
    { label: "Marketing", value: "marketing", Icon: Volume2 },
    { label: "Copywriting", value: "copywriting", Icon: Feather },
    { label: "Others", value: "others", Icon: Users },
];

function Skills({ goToNextSlide }: SlideItemProps): React.JSX.Element {
    const { firstName } = useUserState();
    const { skill, setSkill } = useOnboardingState();
    return (
        <div className="flex w-full shrink-0 flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-1 text-left">
                <p className="text-2xl">Great to meet you, {firstName}.</p>
                <span className="text-4xl font-bold text-[#1f2739]">What are you interested in?</span>
            </div>
            <div className="mt-9 grid w-full grid-cols-3 gap-6">
                {SKILLS.map(({ Icon, label, value }) => (
                    <SkillCard
                        key={value}
                        label={label}
                        Icon={Icon}
                        isActive={skill === value}
                        toggleSelection={() => {
                            setSkill(value);
                        }}
                    />
                ))}
            </div>
            <div className="mx-auto mt-2 w-full max-w-xs">
                <Button fullWidth disabled={skill === ""} onClick={goToNextSlide}>
                    Continue
                </Button>
            </div>
        </div>
    );
}

function UploadProgress({ progress }: { progress: number }): React.JSX.Element {
    return (
        <div className="flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-[#7DDE86] bg-[#ECFCE533] p-4">
            <span className="text-sm">Uploading</span>
            <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#EBEFF2]">
                <div
                    className="h-full rounded-full bg-primary-gradient"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
        </div>
    );
}

const MB_IN_BYTES = 1024 * 1024;
const maxSize = 2 * MB_IN_BYTES;

function ProfileImage(): React.JSX.Element {
    const router = useRouter();
    const { skill } = useOnboardingState();
    const uploadImage = useUploadImage();
    const updateAccount = useUpdateAccount();
    const [uploadProgress, setUploadProgress] = useState(0);

    const [imageFile, setImageFile] = useState<{ file: File; preview: string } | null>(null);

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
                    const payload = { profile: { bio: { title: skill } }, profileImage: data._id };
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
        <div className="relative flex w-full shrink-0 flex-col items-center gap-4">
            <div className="absolute left-[6%] top-[5%] h-[85px] w-[85px] rounded-full opacity-50">
                <Image src="/images/onboarding-1.png" alt="" height={85} width={85} className="rounded-full" />
            </div>
            <div className="absolute left-[0%] top-[50%] h-[85px] w-[85px] -translate-y-1/2 rounded-full opacity-50">
                <Image src="/images/onboarding-2.png" alt="" height={85} width={85} className="rounded-full" />
            </div>
            <div className="absolute bottom-[5%] left-[6%] h-[85px] w-[85px] rounded-full opacity-50">
                <Image src="/images/onboarding-3.png" alt="" height={85} width={85} className="rounded-full" />
            </div>

            <div className="absolute right-[6%] top-[5%] h-[85px] w-[85px] rounded-full opacity-50">
                <Image src="/images/onboarding-4.png" alt="" height={85} width={85} className="rounded-full" />
            </div>
            <div className="absolute right-[0%] top-[50%] h-[85px] w-[85px] -translate-y-1/2 rounded-full opacity-50">
                <Image src="/images/onboarding-5.png" alt="" height={85} width={85} className="rounded-full" />
            </div>
            <div className="absolute bottom-[5%] right-[6%] h-[85px] w-[85px] rounded-full opacity-50">
                <Image src="/images/onboarding-6.png" alt="" height={85} width={85} className="rounded-full" />
            </div>

            <div className="flex flex-col items-center text-body">
                <p className="text-lg">Last Step</p>
                <span className="text-2xl font-bold text-title">Upload Your Profile Image</span>
            </div>

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
                        <Image src={imageFile.preview} alt="profile picture" layout="fill" objectFit="cover" />
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

            <div className="flex h-[80px] w-full items-center justify-center">
                {uploadImage.isLoading || updateAccount.isLoading ? (
                    <UploadProgress progress={uploadProgress} />
                ) : (
                    <div className="w-full max-w-xs">
                        <Button
                            size="sm"
                            fullWidth
                            disabled={imageFile == null || isFileTooLarge}
                            onClick={handleUpload}
                        >
                            Upload Image
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OnBoarding(): React.JSX.Element {
    return <Slider items={[{ SlideItem: Skills }, { SlideItem: ProfileImage }]} />;
}
