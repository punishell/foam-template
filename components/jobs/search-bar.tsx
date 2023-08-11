'use client';
import { Input } from 'pakt-ui';

export const SearchBar = () => {
  return (
    <div className="bg-primary p-6 w-full rounded-2xl grid grid-cols-3 gap-4">
      <div>
        <Input type="text" placeholder="Search" />
      </div>
      <div>
        <Input type="text" placeholder="Skills e.g Figma" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input type="text" placeholder="Min" /> <Input type="text" placeholder="Max" />
      </div>
    </div>
  );
};
