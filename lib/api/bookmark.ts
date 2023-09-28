import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useMutation, useQuery } from '@tanstack/react-query';
import { parseFilterObjectToString } from '../utils';
import { Bookmark } from '../types';

interface GetBookMarkResponse {
  data: Bookmark[];
  page: number;
  limit: number;
}

interface timelineFetchParams {
  page: number;
  limit: number;
  filter: Record<string, any>;
}

async function getBookmarks({ page, limit, filter }: timelineFetchParams): Promise<GetBookMarkResponse> {
  const filters = parseFilterObjectToString(filter);
  const res = await axios.get(`/bookmark?page=${page}&limit=${limit}&${filters}`);
  return res.data.data;
}

async function addToBookmark({ reference, type }: { reference: string; type: string }): Promise<any> {
  const res = await axios.post(`/bookmark`, { reference, type });
  return res.data.data;
}

async function removeFromBookmark({ id }: { id: string }): Promise<any> {
  const res = await axios.delete(`/bookmark/${id}`);
  return res.data.data;
}

export const useGetBookmarks = ({ page, limit, filter }: timelineFetchParams) => {
  return useQuery({
    queryFn: async () => await getBookmarks({ page, limit, filter }),
    queryKey: [`get-bookmark_req_${page}+${limit}`, filter],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (data: GetBookMarkResponse) => {
      return data;
    },
  });
};

export function useSaveToBookmark() {
  return useMutation({
    mutationFn: addToBookmark,
    mutationKey: ['save-bookmark'],
    onSuccess: () => {
      toast.success('Saved to bookmark successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

export function useRemoveFromBookmark() {
  return useMutation({
    mutationFn: removeFromBookmark,
    mutationKey: ['removeFromBookmark'],
    onSuccess: () => {
      toast.success('Removed From bookmark successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}
