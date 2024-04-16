/* eslint-disable @typescript-eslint/no-explicit-any */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, useMutation, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";

interface GetReferrals {
	data: any[];
	limit: number;
	pages: number;
	total: number;
}
interface GetReferralStat {
	referralLink: string;
	totalAllowedInvites: number;
	inviteSent: number;
	duration?: string;
}

interface FetchParams {
	page: number;
	limit: number;
	filter: Record<string, any>;
}

interface SendReferralInviteParams {
	emails: string[];
}

async function fetchReferrals({ limit, page }: FetchParams): Promise<GetReferrals> {
	const res = await axios.get(`/referrals?limit=${limit}&page=${page}`);
	return res.data.data;
}

async function fetchReferralStats(): Promise<GetReferralStat> {
	const res = await axios.get("/referrals/stats");
	return res.data.data;
}

async function postReferralInvite(values: SendReferralInviteParams): Promise<any> {
	const res = await axios.post("/referrals/invite", values);
	return res.data.data;
}

async function validateReferral({ token }: { token: string }): Promise<any> {
	const res = await axios.post("/auth/referral/validate", { token });
	return res.data.data;
}

export const useGetReferral = ({
	page,
	limit,
	filter,
}: FetchParams): UseQueryResult<
	{
		referrals: GetReferrals;
		stats: GetReferralStat;
	},
	ApiError
> => {
	return useQuery({
		queryFn: async () => {
			const response = await Promise.all([fetchReferrals({ page, limit, filter }), fetchReferralStats()]);
			return { referrals: response[0], stats: response[1] };
		},
		queryKey: [`get-bookmark_req_${page}`, filter],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data) => {
			return data;
		},
	});
};

export function useSendReferralInvite(): UseMutationResult<any, ApiError, SendReferralInviteParams, unknown> {
	return useMutation({
		mutationFn: postReferralInvite,
		mutationKey: ["send_referral_invite"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

export function useValidateReferral(): UseMutationResult<
	any,
	unknown,
	{
		token: string;
	},
	unknown
> {
	return useMutation({
		mutationFn: validateReferral,
		mutationKey: ["validateReferral"],
	});
}
