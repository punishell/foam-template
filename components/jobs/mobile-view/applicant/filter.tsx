import React from "react";

export const Filter = () => {
    return (
        <div className="flex h-fit shrink-0 grow-0 basis-[300px] flex-col gap-4 rounded-2xl border border-[#7DDE86] bg-white p-4">
            <div>
                <label htmlFor="score">Afroscore</label>
                <Select
                    placeholder="Highest to lowest"
                    options={SORT_BY}
                    onChange={(value) => {
                        setSortBy("score");
                        setScoreSort(value as SortBy);
                    }}
                />
            </div>
            <div>
                <label htmlFor="bid">Bid</label>
                <Select
                    placeholder="Highest to lowest"
                    options={SORT_BY}
                    onChange={(value) => {
                        setSortBy("bid");
                        setBidSort(value as SortBy);
                    }}
                />
            </div>
            <div className="flex flex-col gap-1">
                <span>Preferred Skills</span>

                <div className="flex flex-col gap-2">
                    {job.tagsData
                        .map((tag) => tag.toLowerCase())
                        .map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    if (skillFilters.includes(tag)) {
                                        setSkillFilters(
                                            skillFilters.filter(
                                                (skill) => skill !== tag
                                            )
                                        );
                                    } else {
                                        setSkillFilters([...skillFilters, tag]);
                                    }
                                }}
                                className="flex w-full items-center justify-between gap-2 rounded-lg border bg-gray-50 px-3 py-3 duration-300 hover:border-[#7DDE86]"
                                type="button"
                            >
                                <span className="capitalize text-body">
                                    {tag}
                                </span>
                                <Checkbox
                                    checked={skillFilters.includes(tag)}
                                />
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
};
