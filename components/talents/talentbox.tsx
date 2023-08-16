import React from "react";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/common";
import { achievementMap, emptyAchievement } from "@/lib/utils";
import { UserAvatar, UserAvatar2 } from "../common/user-avatar";

export const TalentBox: React.FC<{
  id: string;
  name: string;
  title: string;
  imageUrl?: string;
  score?: string;
  width?: string;
  style?: any;
  skills: any[] | [];
  achievements: [];
}> = ({ id, name, title, imageUrl, score, skills, achievements }) => {
  return (
    <div key={id} className="m-0 h-[365px] overflow-hidden rounded-2xl bg-[#ecfce5] p-0">
      <div className="relative z-0 h-full rounded-2xl">
        <div className="top absolute rounded-full left-[-20%] top-[-20%] w-[200px] h-[200px] bg-primary" />
        <div className="bottom absolute right-[-20%] top-[40%] rounded-full w-[200px] h-[200px] bg-primary" />

        <div className="flex relative top-0 mx-auto w-full justify-center p-10 pb-0">
          <Link href={`/talents/${id}`}>
            <UserAvatar size="lg" />
          </Link>
        </div>

        <div className="absolute bottom-0 -mb-[190px] flex h-full w-full flex-col overflow-hidden duration-500 ease-out hover:mb-[0px]">
          <div className="bg-[rgba(255, 237, 237, 0.37)] mx-auto -mb-[145px] h-40 w-40 rounded-full backdrop-blur-[100px]  backdrop-filter">
            <ChevronUp
              className="z-[500] mx-auto -mt-[3px] text-primary"
              size={25}
              strokeWidth={1.5}
            />
          </div>
          <div className="bg-[rgba(255, 237, 237, 0.37)] relative z-50 flex w-full flex-col rounded-2xl pt-2 backdrop-blur-[100px] backdrop-filter">
            <div className="relative rounded-2xl border-t-0 px-5">
              <div className="grid grid-rows-3 gap-1">
                <span className="pb-0 pt-3 text-2xl font-semibold capitalize">
                  {name}
                </span>

                {<span className="text-base">{title || ""}</span>}

                {skills?.length > 0 && (
                  <div className="flex w-full items-center gap-2">
                    {skills?.slice(0, 3).map((skill: any, i:number) => {
                      const { color, name } = skill;
                      return (
                        <span key={i}
                          className="shrink-0 grow items-center gap-2 rounded-md px-3 py-1 text-center capitalize"
                          style={{ backgroundColor: color ?? "#B2AAE9" }}
                        >
                          {limitString(name || skill)}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <h3 className="text-base font-normal">Achievements</h3>
                <div className="grid grid-cols-4 gap-2">
                  {achievements &&
                    achievements.length > 0 &&
                    achievements.map((a: any, i: number) => (
                      <Badge
                        key={i}
                        title={achievementMap[a.type]}
                        userValue={parseInt(a.value) ?? 0}
                        totalNumber={parseInt(a.total)}
                        type={a.type}
                      />
                    ))}
                  {achievements.length == 0 &&
                    emptyAchievement.map((a: any, i: number) => (
                      <Badge
                        key={i}
                        title={a.title}
                        userValue={0}
                        totalNumber={parseInt(a.total)}
                        type={a.title}
                      />
                    ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Link
                  href={`/messaging?userId=${id}`}
                  className="flex h-[42px] grow items-center justify-center rounded-lg border border-[#007c5b] bg-white py-2 text-sm text-primary duration-200 hover:text-primary"
                >
                  Message
                </Link>

                <Link
                  href={`/talents/${id}`}
                  className="flex h-[42px] grow items-center justify-center rounded-lg border bg-primary py-2 text-center text-sm text-white duration-200 hover:bg-opacity-90"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const limitString = (str: string, limit: number = 10) => {
  return str.length > limit ? str.slice(0, limit) + "..." : str;
};
