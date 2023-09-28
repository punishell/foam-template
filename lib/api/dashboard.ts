import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useMutation, useQuery } from '@tanstack/react-query';
import { parseFilterObjectToString } from '../utils';
import { DataFeedResponse } from '../types';

interface CreatorData {
  _id: string;
  firstName: string;
  lastName: string;
  score: number;
  profileImage?: { url: string };
}

interface GetFeedsResponse {
  data: DataFeedResponse[];
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
  const filters = parseFilterObjectToString(filter);
  const res = await axios.get(`/feeds?page=${page}&limit=${limit}&${filters}`);
  return res.data.data;
}

async function getLeaderBoard(): Promise<GetTimelineResponse> {
  const res = await axios.get(`/account/user?limit=6&sort=score&range=1,100`);
  return res.data.data;
}

async function dismissFeed(id: string): Promise<any> {
  const res = await axios.put(`/feed/${id}/dismiss`);
  return res.data.data;
}

async function dismissAllFeed(): Promise<any> {
  const res = await axios.put(`/feed/dismiss/all`);
  return res.data.data;
}

export const useGetTimeline = ({ page, limit, filter }: timelineFetchParams) => {
  return useQuery({
    queryFn: async () => await getTimelineFeeds({ page, limit, filter }),
    queryKey: ['get-timeline', page, filter],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (data: GetFeedsResponse) => {
      return data;
    },
  });
};

export const useGetLeaderBoard = () => {
  return useQuery({
    queryFn: async () => await getLeaderBoard(),
    queryKey: ['get-leaderboard'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (data: GetTimelineResponse) => {
      return data;
    },
  });
};

export function useDismissFeed() {
  return useMutation({
    mutationFn: dismissFeed,
    mutationKey: ['dismiss-feed-by-id'],
    onSuccess: () => {
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
