"use client";
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect } from "react";
import React, { useEffect, useState } from "react";
// import { useDebounce } from "usehooks-ts";
// import { useRouter } from "next/router";
import { JobSearchBar } from "@/components/jobs/job-search-bar";
import { Spinner } from "@/components/common";
import { TalentBox } from "@/components/talents/talentbox";

const demoContent = [
  {
    _id: "asfasfasf90asdfasf",
    name: "John Doe",
    title: "Product Designer",
    score: 63,
    skills: [
      {name: "UI Design", color:"#B2E9AA"},
      {name: "Figma", color:"#E9AAAA"},
      {name: "Interaction", color:"#E9DBAA"},
    ],
    achievements: []
  }
];

export default function Talents() {
  const [isSearching, setIsearching] = useState(false);
  // const router = useRouter();
  const Limit = "12";
  const userType = "talent";
  const talentList = { data: demoContent };

  // const rQuery = router.query;

  const FetchTalents = async ({ page = "1", limit = Limit, ...props }) => { };

  useEffect(() => {
    FetchTalents({});
  }, []);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="text-3xl text-title font-bold">Talents</div>
      </div>
      <JobSearchBar />
      <TalentList
        isLoading={isSearching}
        talents={talentList.data}
        userType={userType}
      />
      {!isSearching && talentList.data.length > 0 && (
        <div className="mt-auto">
          {/* <Pagination
            totalPages={talentList.pages}
            setCurrentPage={handlePagination}
            currentPage={talentList.page}
          /> */}
        </div>
      )}
    </div>
  );
}


interface TalentListProps {
  talents: any;
  userType: string;
  isLoading?: boolean;
}

const TalentList: React.FC<TalentListProps> = ({ isLoading, talents, userType,
}) => {
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!isLoading && talents.length === 0) {
    return <div className="m-auto text-lg text-body"> no result found...</div>;
  }

  return (
    <div className="w-full">
      <div className="mt-10 grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
        {talents.length > 0 &&
          talents.map((t: any, i: number) => (
              <TalentBox
                key={i}
                id={t._id}
                name={t.name}
                title={t?.title}
                score={t?.score}
                // imageUrl={t?.profileImage?.url}
                skills={t?.skills}
                achievements={t?.achievements ?? []}
              />
            ))}
        {isLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};
