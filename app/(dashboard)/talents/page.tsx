/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Layout } from "@/common/Layout";
import { Search } from "@/components/Talent/Search/Search";
import { Skills } from "@/components/Talent/Skills/Skills";
import { AfroScoreInput } from "@/components/Talent/AfroScoreInput/AfroScoreInput";
import { TalentBox } from "@/components/Talent/TalentBox/TalentBox";
import { fetchTalents } from "@/lib/apiServices/talent";
import { useEffect } from "react";
import Spinner from "@/common/Spinner";
import React, { useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Pagination } from "@/components/Pagination";
import { useRouter } from "next/router";
import { ProtectedRoute } from "@/common/ProtectedRoute";
import { useUserState } from "@/store/store";

export default function Talents() {
  const { type } = useUserState();
  const [talentLists, setTalentLists] = useState<any>({ data: [] });
  const [searchResults, setSearchResults] = useState<any>({ data: [] });
  const [isSearching, setIsSearching] = useState(true);
  const [isSearched, setIsSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSkills, setSearchSkills] = useState("");
  const [searchRange, setSearchRange] = useState("");
  const router = useRouter();
  const Limit = "12";
  const userType = type == "creator" ? "client" : "talent";
  const talentList = isSearched ? searchResults?.data?.length > 0 ? searchResults : { data: [] } : talentLists ?? { data: [] };

  const rQuery = router.query;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedSearchSkills = useDebounce(searchSkills, 500);
  const debouncedSearchRange = useDebounce(searchRange, 500);

  const FetchTalents = async ({ page = "1", limit = Limit, ...props }) => {
    setIsSearching(true);
    const payload = await fetchTalents({ page, limit, ...props });
    if (payload) {
      if (props?.search || props?.range || props?.skills) {
        setSearchResults(payload);
        setIsSearched(true);
      } else {
        setTalentLists(payload);
        setIsSearched(false);
      }
    }
    setIsSearching(false);
  };

  useEffect(() => {
    FetchTalents({});
  }, []);

  useEffect(() => {
    if (rQuery) {
      if (rQuery?.search) setSearchTerm(String(rQuery?.search));
      if (rQuery.skills) setSearchSkills(String(rQuery.skills));
      if (rQuery.range) setSearchRange(String(rQuery?.range));
      return;
    }
  }, [rQuery]);

  const handleSearch = (filter: object | any) => {
    setSearchTerm(filter?.search);
    setSearchSkills(filter?.skills);
    setSearchRange(filter?.range);
    return;
  };

  const callSearchQuery = async () => {
    if (debouncedSearchTerm || debouncedSearchSkills || debouncedSearchRange) {
      return FetchTalents({
        search: searchTerm,
        skills: debouncedSearchSkills,
        range: debouncedSearchRange,
      });
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    callSearchQuery();
  }, [debouncedSearchTerm, debouncedSearchSkills, debouncedSearchRange]);

  const handlePagination = (page: number) => {
    return FetchTalents({ page: String(page), limit: Limit });
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <SearchBar handleSearch={handleSearch} searchTerm={searchTerm} searchSkills={searchSkills} searchRange={searchRange} />
      <TalentList
        isLoading={isSearching}
        talents={talentList.data}
        userType={userType}
      />
      {!isSearching && talentList.data.length > 0 && (
        <div className="mt-auto">
          <Pagination
            totalPages={talentList.pages}
            setCurrentPage={handlePagination}
            currentPage={talentList.page}
          />
        </div>
      )}
    </div>
  );
}

const SearchBar: React.FC<{
  handleSearch: (filter: object) => void;
  searchTerm?: string;
  searchSkills?: string;
  searchRange?: string;
}> = ({ handleSearch, searchTerm, searchSkills, searchRange }) => {
  return (
    <div className="grid grid-cols-3 justify-center gap-4">
      <Search handleSearch={handleSearch} searchTerm={searchTerm} />
      <Skills handleSearch={handleSearch} searchSkills={searchSkills} />
      <AfroScoreInput
        handleSearch={handleSearch}
        minR={searchRange?.split(",")[0]}
        maxR={searchRange?.split(",")[1]}
      />
    </div>
  );
};

interface TalentListProps {
  talents: any;
  userType: string;
  isLoading?: boolean;
}

const TalentList: React.FC<TalentListProps> = ({
  isLoading,
  talents,
  userType,
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
    <section className="w-full">
      <div>
        <div className="mt-10 grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {talents.length > 0 &&
            talents.map((t: any, i: number) => (
              <TalentBox
                key={i}
                id={t._id}
                name={`${t.firstName} ${t.lastName}`}
                title={t?.profile?.bio?.title || ""}
                userType={userType}
                score={t?.score}
                imageUrl={t?.profileImage?.url}
                skills={
                  t?.profile?.talent?.skillIds ?? t?.profile?.talent?.skills
                }
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
    </section>
  );
};
