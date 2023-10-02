import Image from "next/image"
import { AfroProfile } from "../common/afro-profile"
import { DefaultAvatar } from "../common/default-avatar"

type Size = 'sm' | 'md' | 'lg' | 'xl';

export const ProfileImage = ({ imageUrl, score = 0, size = "lg" }: { imageUrl?: string, score?: number, size?: Size }) => {
  return (
    <AfroProfile score={score} size={size}>
      <div className="h-full w-full rounded-full relative">
        {imageUrl ? (
          <Image src={imageUrl} fill alt="profile" objectFit='cover' className="rounded-full p-1" />
        ) : (
          <DefaultAvatar />
        )}
      </div>
    </AfroProfile>
  )
}