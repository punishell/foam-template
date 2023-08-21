import { Spinner } from "../common";
import { Pagination } from "../common/pagination";
import { TalentBox } from "./talentbox";

interface TalentListProps {
  talents: any;
  currentPage: number;
  totalPages: number;
  handlePagination: (page: number) => void;
  isLoading?: boolean;
}

export const TalentList: React.FC<TalentListProps> = ({ isLoading, talents, currentPage, totalPages, handlePagination }) => {
  const RenderLoading = () => {
    return (
      <div className="flex h-full w-full my-auto items-center justify-center z-20">
        <Spinner />
      </div>
    );
  }

  const RenderEmpty = () => {
    return <div className="flex flex-row text-lg h-full text-center w-full text-body my-auto items-center justify-center"> <p>no result found...</p></div>;
  }

  return (
    <div className="h-full w-full">
      {!isLoading ?
        <div className="flex flex-col h-full">
          <div className="mt-10 grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {talents.length > 0 && talents.map((t: any, i: number) => (
              <TalentBox
                key={i}
                id={t._id}
                name={t.name}
                title={t?.title}
                score={t?.score}
                imageUrl={t?.image}
                skills={t?.skills}
                achievements={t?.achievements ?? []}
              />
            ))}
          </div>
          {talents.length === 0 && <RenderEmpty />}
          <div className="mt-auto">
            <Pagination
              totalPages={totalPages}
              setCurrentPage={handlePagination}
              currentPage={currentPage}
            />
          </div>
        </div>
        : <RenderLoading />}
    </div>
  );
};
