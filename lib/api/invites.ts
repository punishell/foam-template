import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useMutation, useQuery } from '@tanstack/react-query';
import { parseFilterObjectToString } from '../utils';

// Get Invites
interface getInviteParams {
  page?: number;
  limit?: number;
  filter?: Record<string, any>;
}

interface GetInviteResponse {
  data: {
    status: 'pending' | 'accepted' | 'rejected';
    _id: string;
    createdAt: string;
    data: {
      _id: string;
      name: string;
      isPrivate: boolean;
      escrowPaid: boolean;
      deliveryDate: string;
      description: string;
      paymentFee: number;
      creator: {
        firstName: string;
        lastName: string;
        score: number;
        profileImage?: {
          url: string;
        };
        profile: {
          bio: {
            title: string;
            description: string;
          };
          talent: {
            tags: string[];
          };
        };
      };
    };
  }[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

async function getInvites({ page = 1, limit = 10, filter }: getInviteParams): Promise<GetInviteResponse> {
  const filters = parseFilterObjectToString(filter || {});
  const res = await axios.get('/invite', {
    params: {
      page,
      limit,
      filter: filters,
    },
  });
  return res.data.data;
}

export const useGetInvites = ({ page, limit, filter }: getInviteParams) => {
  return useQuery({
    queryFn: async () => await getInvites({ page, limit, filter }),
    queryKey: ['get-invites'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
};

// Accept Invite

interface AcceptInviteResponse {
  meta: string;
  message: string;
}

async function acceptInvite({ id }: { id: string }): Promise<AcceptInviteResponse> {
  const res = await axios.post(`/invite/${id}/accept`);
  return res.data.data;
}

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

// Decline Invite

interface DeclineInviteResponse {
  meta: string;
  message: string;
}

async function declineInvite({ id }: { id: string }): Promise<DeclineInviteResponse> {
  const res = await axios.post(`/invite/${id}/decline`);
  return res.data.data;
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
