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

export const TalentList: React.FC<TalentListProps> = ({
    isLoading,
    talents,
    currentPage,
    totalPages,
    handlePagination,
}) => {
    const RenderLoading = () => {
        return (
            <div className="z-20 my-auto flex h-full w-full items-center justify-center">
                <Spinner />
            </div>
        );
    };

    const RenderEmpty = () => {
        return (
            <div className="my-auto flex h-full w-full flex-row items-center justify-center text-center text-lg text-body">
                {" "}
                <p>no result found...</p>
            </div>
        );
    };

    return (
        <div className="h-full w-full">
            {!isLoading ? (
                <>
                    <div className="flex h-full flex-col">
                        <div className="grid grid-cols-1 items-center justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {talents.length > 0 &&
                                talents.map((t: any, i: number) => (
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
                        <div className="mt-auto py-4">
                            <Pagination
                                totalPages={totalPages}
                                setCurrentPage={handlePagination}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <RenderLoading />
            )}
        </div>
    );
};
