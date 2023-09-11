import { axios, ApiError, ApiResponse } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';

// Talent Fetch
interface talentFetchParams {
  page: number;
  limit: number;
  filter: Record<string, any>;
}

async function getTalent({ limit = 20, page = 1, filter }: talentFetchParams) {
  const filters = parseFilterObjectToString(filter);
  return await axios.get(`/account/user?limit=${limit}&page=${page}&${filters}`);
}

async function getTalentById(id: string) {
  return await axios.get(`/account/user/${id}`);
}

async function getTalentReview(userId: string, page: string, limit: string) {
  return await axios.get(`/reviews?userId=${userId}&page=${page}&limit=${limit}`);
}

import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { parseFilterObjectToString } from '../utils';
import { toast } from '@/components/common/toaster';

// GET ACCOUNT DETAILS
type GetTalentFetchSuccess = ApiResponse<any>;

type GetTalentFetchDetailsError = ApiError<null>;

const getQueryKey: QueryKey = ["talents"];
const getQueryIdKey: QueryKey = ["talents-id"];

export const useGetTalents = ({ limit, page, filter }: talentFetchParams) => {
  const options: UseQueryOptions<GetTalentFetchSuccess, GetTalentFetchDetailsError> = {
    queryFn: async () => {
      return await getTalent({ limit, page, filter })
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "An error fetching talents occurred");
    },
    // onSuccess: () => {},
    enabled: true,
  };

  return useQuery(getQueryKey, options);
};

export const useGetTalentById = (id: string) => {
  const options: UseQueryOptions<any, GetTalentFetchDetailsError> = {
    queryFn: async () => {
      const [talent, review] = await Promise.all([getTalentById(id), getTalentReview(id, "1", "4")]);
      return { talent, review };
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "An error fetching talents occurred");
    },
    // onSuccess: () => {},
    enabled: true,
  };

  return useQuery(getQueryIdKey, options);
}

// export const useGetTalentReviews = (userId: string) => {
//   const options: UseQueryOptions<GetTalentFetchSuccess, GetTalentFetchDetailsError> = {
//     queryFn: async () => {
//       return await getTalentReview(userId, "1", "4")
//     },
//     onError: (error) => {
//       toast.error(error.response?.data.message || "An error fetching talents occurred");
//     },
//     // onSuccess: () => {},
//     enabled: true,
//   };

//   return useQuery(getQueryIdKey, options);
// }