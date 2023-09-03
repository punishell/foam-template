import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags, className }) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
    if (event.key === 'Backspace' && inputValue === '') {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div
      className={`${cn(
        'flex flex-wrap items-center gap-2 border rounded-lg px-2 py-2 border-line hover:border-secondary peer-focus-within:border-secondary group-focus-within:border-secondary duration-200',
        className,
      )}`}
    >
      {tags.map((tag) => (
        <div
          key={tag}
          className="inline-flex items-center gap-2 rounded-full border border-primary border-opacity-30 !bg-[#ECFCE5] px-3 py-1 text-sm text-[#198155]"
        >
          <span>{tag}</span>
          <button type="button" className="text-[#198155]" onClick={() => setTags(tags.filter((t) => t !== tag))}>
            <X size={16} strokeWidth={1} />
          </button>
        </div>
      ))}
      <input
        type="text"
        className="flex-grow outline-none peer"
        placeholder="Add skills"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};