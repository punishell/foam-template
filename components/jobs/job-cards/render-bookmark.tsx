import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useRemoveFromBookmark, useSaveToBookmark } from '@/lib/api/bookmark';

interface bookmarkType {
  id: string;
  size: number;
  type: string;
  isBookmarked?: boolean;
  bookmarkId: string;
  callback?: () => void;
}
export const RenderBookMark = ({ size = 20, isBookmarked, id, bookmarkId, type = 'collection', callback }: bookmarkType) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const addBookmark = useSaveToBookmark();
  const removeBookmark = useRemoveFromBookmark();
  const CallFuc = () => {
    return bookmarked
      ? removeBookmark.mutate(
        { id: bookmarkId },
        {
          onSuccess: (_data) => {
            setBookmarked(!bookmarked);
          },
          onSettled: () => {
            callback && callback();
          }
        },
      )
      : addBookmark.mutate(
        { reference: id, type },
        {
          onSuccess: (_data) => {
            setBookmarked(!bookmarked);
          },
          onSettled: () => {
            callback && callback();
          }
        },
      );
  };
  return (
    <Bookmark
      fill={isBookmarked ? '#404446' : '#FFFFFF'}
      className="cursor-pointer"
      size={size}
      onClick={() => CallFuc()}
    />
  );
};