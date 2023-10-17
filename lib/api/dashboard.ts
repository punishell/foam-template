import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DataFeedResponse } from '../types';

interface CreatorData {
  _id: string;
  firstName: string;
  lastName: string;
  score: number;
  profileImage?: { url: string };
}

interface GetFeedsResponse {
  data: DataFeedResponse[] | [];
  limit: number;
  page: number;
  pages: number;
  total: number;
}

interface GetTimelineResponse {
  data: CreatorData[];
}

interface timelineFetchParams {
  page: number;
  limit: number;
  filter: Record<string, any>;
}

async function getTimelineFeeds({ page, limit, filter }: timelineFetchParams): Promise<GetFeedsResponse> {
  const res = await axios.get(`/feeds`, {
    params: {
      page,
      limit,
      ...filter,
    },
  });
  return res.data.data;
}

async function getLeaderBoard(): Promise<GetTimelineResponse> {
  const res = await axios.get(`/account/user?limit=10&sort=score&range=1,100`);
  return res.data.data;
}

async function dismissFeed(id: string): Promise<any> {
  const res = await axios.put(`/feeds/${id}/dismiss`);
  return res.data.data;
}

async function dismissAllFeed(): Promise<any> {
  const res = await axios.put(`/feeds/dismiss/all`);
  return res.data.data;
}

export const useGetTimeline = ({ page, limit, filter }: timelineFetchParams) => {
  return useInfiniteQuery(
    [`get-timeline_${page}_${limit}`],
    async ({ pageParam = 1 }) => (await getTimelineFeeds({ page: pageParam, limit, filter })).data,
    {
      getNextPageParam: (_, pages) => pages.length + 1,
      enabled: true,
    },
  );
  // return useQuery({
  //   queryFn: async () => await getTimelineFeeds({ page, limit, filter }),
  //   queryKey: [`get-timeline_${page}_${limit}`],
  //   onError: (error: ApiError) => {
  //     toast.error(error?.response?.data.message || 'An error occurred');
  //   },
  //   onSuccess: (data: GetFeedsResponse) => {
  //     return data;
  //   },
  //   enabled: false,
  // });
};

export const useGetLeaderBoard = () => {
  return useQuery({
    queryFn: async () => await getLeaderBoard(),
    queryKey: ['get-leader-board'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (data: GetTimelineResponse) => {
      return data;
    },
  });
};

export function useDismissFeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dismissFeed,
    mutationKey: ['dismiss-feed-by-id'],
    onSuccess: async () => {
      await queryClient.refetchQueries([`get-timeline_1_10`], {
        stale: true,
      });
      toast.success('Feed Dismissed successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

export function useDismissAllFeed() {
  return useMutation({
    mutationFn: dismissAllFeed,
    mutationKey: ['dismiss-all-feed'],
    onSuccess: () => {
      toast.success('All Feeds Dismissed successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}
