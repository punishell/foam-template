import { ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { useMutation } from "@tanstack/react-query";

interface createFeedPayload {
    owners?: string[];
    title: string;
    description: string;
    type: string;
    data: string;
    isPublic: boolean;
    meta?: Record<string, any>;
}

async function postFeed({ owners, title, description, type, data, isPublic, meta }: createFeedPayload): Promise<any> {
    const res = await axios.post(`/feeds`, { owners, title, description, type, data, isPublic, meta });
    return res.data.data;
}

export function useCreateFeed() {
    return useMutation({
        mutationFn: postFeed,
        mutationKey: ["post-feed"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message || "An error occurred");
        },
    });
}
