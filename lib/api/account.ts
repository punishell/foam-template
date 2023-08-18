import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { ApiError, ApiResponse, axios } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useUserState, IUser } from "@/lib/store/account";

// GET ACCOUNT DETAILS
type GetAccountDetailsSuccess = ApiResponse<IUser>;

type GetAccountDetailsError = ApiError<null>;

export const getAccountQueryKey: QueryKey = ["account-details"];

export const fetchUserAccount = () => axios.get("/account");

export const useGetAccount = () => {
  const { setUser } = useUserState();

  const options: UseQueryOptions<
    GetAccountDetailsSuccess,
    GetAccountDetailsError
  > = {
    queryFn: async () => {
      return await fetchUserAccount();
    },
    onError: (error) => {
      toast.error(error.response?.data.message || "An error occurred");
      return null;
    },
    onSuccess: ({ data }) => {
      const { data: userData } = data;
      setUser(userData);
    },
  };

  return useQuery(getAccountQueryKey, options);
};


export const useUpdateAccount = () => {

}