import React, { useState } from 'react';
import { Bookmark, CheckCircle, CheckCircle2 } from 'lucide-react';
import { useRemoveFromBookmark, useSaveToBookmark } from '@/lib/api/bookmark';
import { CheckMark } from '@/components/common/icons';

interface bookmarkType {
  id: string;
  size: number;
  type: string;
  isBookmarked?: boolean;
  bookmarkId: string;
  callback?: () => void;
  useCheck?: boolean;
}
export const RenderBookMark = ({ size = 20, isBookmarked, id, bookmarkId, type = 'collection', callback, useCheck }: bookmarkType) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const addBookmark = useSaveToBookmark(callback);
  const removeBookmark = useRemoveFromBookmark(callback);
  const CallFuc = () => {
    if (bookmarked) {
      setBookmarked(false);
      return removeBookmark.mutate(
        { id: bookmarkId },
        {
          onSuccess: (_data) => {
            setBookmarked(false);
          },
          onSettled: () => {
            callback && callback();
          }
        },
      )
    }
    setBookmarked(true);
    return addBookmark.mutate(
      { reference: id, type },
      {
        onSuccess: (_data) => {
          setBookmarked(true);
        },
        onSettled: () => {
          callback && callback();
        }
      },
    );
  };
  if (useCheck) {
    return (
      <div className='flex flex-end min-w-fit' onClick={CallFuc}>
        <CheckMark
          fill={bookmarked ? '#7DDE86' : undefined}
          className={`cursor-pointer`}
          size={24}
        /> <span className='ml-2'>{bookmarked ? "Saved" : "Save"}</span>
      </div>
    )
  }
  return (
    <Bookmark
      fill={bookmarked ? '#404446' : '#FFFFFF'}
      className="cursor-pointer"
      size={size}
      onClick={() => CallFuc()}
    />
  );
};