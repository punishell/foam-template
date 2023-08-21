import {
  useQuery,
  useMutation,
  type QueryKey,
  type UseQueryOptions,
  MutationKey,
} from "@tanstack/react-query";
import { ApiError, ApiResponse, axios } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useUserState, IUser } from "@/lib/store/account";

interface UpdateAccountParams {

}

// GET ACCOUNT DETAILS
type GetAccountDetailsSuccess = ApiResponse<IUser>;
type GetAccountDetailsError = ApiError<null>;

// quer/mutation keys
const getAccountQueryKey: QueryKey = ["account-details"];
const updateUserAccountKey: MutationKey = ['updateUserAccount'];

// api calls
const fetchUserAccount = async () => await axios.get("/account");
const updateUserAccount = async (values:UpdateAccountParams) => await axios.post("/account", {...values});

// get user account query
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
// update account mutation
export const useUpdateAccount = () => {
  return useMutation({
    mutationFn: updateUserAccount,
    mutationKey: updateUserAccountKey,
  });
}
