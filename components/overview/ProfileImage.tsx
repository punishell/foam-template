import Image from "next/image"
import { AfroProfile } from "../common/afro-profile"
import { DefaultAvatar } from "../common/default-avatar"

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


export const ProfileImage = ({ imageUrl, score = 0, size = "lg" }: { imageUrl?: string, score?: number, size?: Size }) => {
  const imgSize = SIZE_TO_PX[size] - DIFF_TO_PX[size];
  const padding = size === "xl" ? "p-3" : "p-2";
  return (
    <AfroProfile score={score} size={size}>
      <div className="h-full w-full rounded-full relative">
        {imageUrl ? (
          <Image src={imageUrl} width={imgSize} height={imgSize} alt="profile" objectFit="cover" className={"absolute rounded-full " + padding} style={{ width: imgSize, height: imgSize }} />
        ) : (
          <DefaultAvatar />
        )}
      </div>
    </AfroProfile>
  )
}