import Image from "next/image";
import { AfroScore } from "../common/afro-profile";
// import { DefaultAvatar } from "../common/default-avatar"
const DefaultAvatar = "/images/defaultuser.svg";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_TO_PX: Record<Size, number> = {
    sm: 60,
    md: 110,
    lg: 150,
    xl: 180,
};

const DIFF_TO_PX: Record<Size, number> = {
    sm: 10,
    md: 10,
    lg: 10,
    xl: 10,
};

const PAD_TO_PX: Record<Size, string> = {
    sm: "",
    md: "p-1",
    lg: "p-3",
    xl: "p-3",
};

export const ProfileImage = ({
    imageUrl = DefaultAvatar,
    score = 0,
    size = "lg",
    allowPadded = false,
}: {
    imageUrl?: string;
    score?: number;
    size?: Size;
    allowPadded?: boolean;
}) => {
    // const imgSize = SIZE_TO_PX[size] - DIFF_TO_PX[size];
    // const padding = allowPadded ? PAD_TO_PX[size] : "";
    const srcUrl = imageUrl ? imageUrl : DefaultAvatar;
    return (
        <AfroScore score={score} size={size}>
            <div className="flex h-full w-full items-center rounded-[100%]">
                <Image
                    src={srcUrl}
                    alt="profile"
                    layout="fill"
                    objectFit="cover"
                    fill
                    className="h-full w-full rounded-[100%] p-1"
                />
            </div>
        </AfroScore>
    );
};
