/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseQueryResult, useQuery } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";

interface CategoryData {
    _id: string;
    name: string;
    color: string;
    categories: unknown[]; // Replace 'any' with more specific type if categories have a defined structure
    isParent: boolean;
    type: string;
    createdAt: string; // ISO Date string, could also use Date type
    updatedAt: string; // ISO Date string, could also use Date type
    __v: number;
}

interface CategoryResponse {
    data: CategoryData[];
}

async function getLeaderBoard(): Promise<CategoryResponse> {
    const res = await axios.get(`/categories`);
    return res.data.data;
}

export const useGetCategory = (): UseQueryResult<CategoryResponse, ApiError> => {
    return useQuery({
        queryFn: async () => getLeaderBoard(),
        queryKey: ["get-category"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
        onSuccess: (data: CategoryResponse) => {
            return data;
        },
    });
};
