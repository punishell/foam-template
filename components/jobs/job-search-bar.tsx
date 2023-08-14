'use client';
import { Search } from 'lucide-react';

export const JobSearchBar = () => {
  return (
    <div className="bg-white border-[#7DDE86] border p-6 w-full rounded-2xl flex gap-4 items-end">
      <div className="flex flex-col relative grow gap-1">
        <label htmlFor="" className="text-sm">
          Job Title
        </label>
        <input
          type="text"
          placeholder="Enter"
          className="bg-gray-50 px-3 border border-line rounded-lg h-11 focus:outline-none"
        />
      </div>
      <div className="flex flex-col relative grow gap-1">
        <label htmlFor="" className="text-sm">
          Search
        </label>
        <input
          type="text"
          placeholder="Enter"
          className="bg-gray-50 px-3 border border-line rounded-lg h-11 focus:outline-none"
        />
      </div>
      <div className="flex flex-col relative grow gap-1">
        <label htmlFor="" className="text-sm">
          Price
        </label>
        <div className="flex gap-2 border py-2 border-line rounded-lg h-11 bg-gray-50">
          <input
            type="text"
            placeholder="From"
            className="grow focus:outline-none bg-transparent px-3 placeholder:text-sm"
          />
          <div className="border-r border-line" />
          <input
            type="text"
            placeholder="To"
            className="grow focus:outline-none bg-transparent px-3 placeholder:text-sm"
          />
        </div>
      </div>
      <button className="p-2 flex items-center justify-center h-11 bg-[#ECFCE5] text-primary border border-primary px-6 rounded-xl">
        <Search size={20} />
      </button>
    </div>
  );
};
