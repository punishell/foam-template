import Image from "next/image"
import { AfroProfile } from "../common/afro-profile"
// import { DefaultAvatar } from "../common/default-avatar"
const DefaultAvatar = "/images/defaultuser.svg";

type Size = 'sm' | 'md' | 'lg' | 'xl';

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
  sm: '',
  md: 'p-1',
  lg: 'p-3',
  xl: 'p-3',
};


export const ProfileImage = ({ imageUrl = DefaultAvatar, score = 0, size = "lg", allowPadded = false }: { imageUrl?: string, score?: number, size?: Size, allowPadded?: boolean }) => {
  // const imgSize = SIZE_TO_PX[size] - DIFF_TO_PX[size];
  // const padding = allowPadded ? PAD_TO_PX[size] : "";
  const srcUrl = imageUrl ? imageUrl : DefaultAvatar;
  return (
    <AfroProfile score={score} size={size}>
      <div className="flex items-center h-full w-full rounded-[100%]">
        <Image src={srcUrl} alt="profile" layout="fill" objectFit="cover" fill className="p-1 h-full w-full rounded-[100%]" />
      </div>
    </AfroProfile>
  )
}