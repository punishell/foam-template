import { axios, ApiError, ApiResponse } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { User } from '@/lib/types';
import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';
import { parseFilterObjectToString } from '../utils';
import { toast } from '@/components/common/toaster';

// Talent Fetch

// GET ACCOUNT DETAILS
type GetTalentFetchSuccess = {
  talent: User;
  review: reviewResponse;
};

type GetTalentFetchDetailsError = ApiError<null>;

const getQueryKey: QueryKey = ['talents'];
const getQueryIdKey: QueryKey = ['talents-id'];

interface talentFetchParams {
  page: number;
  limit: number;
  filter: Record<string, any>;
}
interface talentListResponse {
  data: User[];
  pages: number;
  page: number;
  limit: number;
  total: number;
}
interface reviewResponse {
  data: [];
}

async function getTalent({ limit = 20, page = 1, filter }: talentFetchParams): Promise<talentListResponse> {
  const filters = parseFilterObjectToString(filter);
  const res = await axios.get(`/account/user?limit=${limit}&page=${page}&${filters}`);
  return res.data.data;
}

async function getTalentById(id: string): Promise<User> {
  const talent = await axios.get(`/account/user/${id}`);
  return talent.data.data;
}

async function getTalentReview(userId: string, page: string, limit: string): Promise<reviewResponse> {
  const review = await axios.get(`/reviews?userId=${userId}&page=${page}&limit=${limit}`);
  return review.data.data;
}

export const useGetTalents = ({ limit, page, filter }: talentFetchParams) => {
  const options: UseQueryOptions<talentListResponse, GetTalentFetchDetailsError> = {
    queryFn: async () => {
      return await getTalent({ limit, page, filter });
    },
    onError: (error) => {
      toast.error(error.response?.data.message || 'An error fetching talents occurred');
    },
    enabled: true,
  };

  return useQuery(getQueryKey, options);
};

export const useGetTalentById = (id: string) => {
  const options: UseQueryOptions<GetTalentFetchSuccess, GetTalentFetchDetailsError> = {
    queryFn: async () => {
      const [talent, review] = await Promise.all([getTalentById(id), getTalentReview(id, '1', '4')]);
      return { talent, review };
    },
    queryKey: ['talent_id_' + id],
    onError: (error) => {
      toast.error(error.response?.data.message || 'An error fetching talents occurred');
    },
    enabled: false,
  };

  return useQuery(getQueryIdKey, options);
};


export const useGetTalentReviewById = (id: string) => {
  const options: UseQueryOptions<reviewResponse, GetTalentFetchDetailsError> = {
    queryFn: async () => {
      const review = await getTalentReview(id, '1', '4');
      return review;
    },
    queryKey: ['talent_review_id_' + id],
    onError: (error) => {
      toast.error(error.response?.data.message || 'An error fetching talents occurred');
    },
    enabled: false,
  };

  return useQuery(getQueryIdKey, options);
};
