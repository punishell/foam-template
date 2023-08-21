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

import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { parseFilterObjectToString } from '../utils';

// GET ACCOUNT DETAILS
type GetTalentFetchSuccess = ApiResponse<any>;

type GetTalentFetchDetailsError = ApiError<null>;

const getQueryKey: QueryKey = ["talents"];

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
