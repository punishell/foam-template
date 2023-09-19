import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useMutation, useQuery } from '@tanstack/react-query';
import { parseFilterObjectToString } from '../utils';

interface GetFeedsresponse {
  data: Record<string, any>[];
  page: number;
  limit: number;
}

interface invitesFetchParams {
  page: number;
  limit: number;
  filter: Record<string, any>;
}

async function getInvites({ page, limit, filter }: invitesFetchParams): Promise<GetFeedsresponse> {
  const filters = parseFilterObjectToString(filter);
  const res = await axios.get(`/invite?page=${page}&limit=${limit}&${filters}`);
  return res.data.data;
}

async function acceptInvite({ id }: { id: string }): Promise<any> {
  const res = await axios.put(`/invite/${id}/accept`);
  return res.data.data;
}

async function declineInvite({ id }: { id: string }): Promise<any> {
  const res = await axios.put(`/invite/${id}/decline`);
  return res.data.data;
}

export const useGetInvites = ({ page, limit, filter }: invitesFetchParams) => {
  return useQuery({
    queryFn: async () => await getInvites({ page, limit, filter }),
    queryKey: ['get-invites'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (data: GetFeedsresponse) => {
      return data;
    },
  });
};

export function useAcceptInvite() {
  return useMutation({
    mutationFn: acceptInvite,
    mutationKey: ['invite-call-action'],
    onSuccess: () => {
      toast.success('Invite Accepted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

export function useDeclineInvite() {
  return useMutation({
    mutationFn: declineInvite,
    mutationKey: ['invite-call-action'],
    onSuccess: () => {
      toast.success('Invite Declined successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}
