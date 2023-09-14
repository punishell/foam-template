"use client";
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { JobSearchBar } from "@/components/jobs/job-search-bar";
import { useGetTalents } from "@/lib/api";
import { TalentList } from "@/components/talents/talentList";
import { parseFilterObjectToString } from "@/lib/utils";

export default function Talents() {
  const [isSearching, setIsSearching] = useState(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryParams = new URLSearchParams(searchParams as any);
  const router = useRouter();
  const Limit = queryParams.get("limit") || "12";
  const page = queryParams.get("page") || '1';
  const searchQ = queryParams.get('search') || "";
  const skillQ = queryParams.get('skills') || "";
  const rangeQ = queryParams.get('range') || "";

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams as any);
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const { data: talentData, refetch: fetchTalents, isFetched, isFetching } = useGetTalents({ page: parseInt(page), limit: parseInt(Limit), filter: { search: searchQ, skills: skillQ, range: rangeQ } });

  const talentLists = useMemo(() => {
    setIsSearching(false);
    return (talentData?.data || []).map((talent: any) => ({
      _id: talent._id,
      name: `${talent.firstName} ${talent.lastName}`,
      title: talent?.profile?.bio?.title || "",
      score: talent?.score || 0,
      image: talent?.profileImage?.url || "",
      skills: (talent?.profile?.talent?.tagsIds || []).map((t: any) => ({ name: t.name, color: t.color })),
      achievements: talent?.achievements.map((a: any) => ({
        total: a.total,
        value: a.value,
        type: a.type,
      })),
    }))
  }, [talentData?.data]);

  useEffect(() => {
    fetchTalents();
  }, [searchParams]);

  const handlePagination = (page: number) => {
    setIsSearching(true);
    return router.push(`${pathname}?${createQueryString('page', String(page))}`)
  };

  const handleSearch = (data: Record<string, any>) => {
    const query = parseFilterObjectToString(data);
    setIsSearching(true);
    return router.push(`${pathname}?${query}`);
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto">
      <div className="flex items-center justify-between">
        <div className="text-3xl text-title font-bold">Talents</div>
      </div>
      <JobSearchBar handleSearch={handleSearch} search={searchQ} skills={skillQ} range={rangeQ} isTalentView />
      <div className="grow">
        <TalentList
          isLoading={(!isFetched && isFetching) || isSearching}
          talents={talentLists}
          totalPages={Number(talentData?.pages)}
          currentPage={Number(talentData?.page)}
          handlePagination={handlePagination}
        />
      </div>
    </div>
  );
}
