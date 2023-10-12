import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  const res = await axios.get(`/bookmark`, {
    params: {
      page,
      limit,
      ...filter,
    },
  });
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
    queryKey: [`get-bookmark_req_${page}+${limit}`],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (data: GetBookMarkResponse) => {
      return data;
    },
  });
};

export function useSaveToBookmark(callBack?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToBookmark,
    mutationKey: ['save-bookmark'],
    onSuccess: async () => {
      queryClient.refetchQueries([`get-bookmark_req`]);
      queryClient.refetchQueries(['get-timeline']);
      callBack && (await callBack());
      toast.success('Saved to bookmark successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

export function useRemoveFromBookmark(callBack?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromBookmark,
    mutationKey: ['removeFromBookmark'],
    onSuccess: async () => {
      queryClient.refetchQueries([`get-bookmark_req`]);
      queryClient.refetchQueries(['get-timeline']);
      callBack && (await callBack());
      toast.success('Removed From bookmark successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}
