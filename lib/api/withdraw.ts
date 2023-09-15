import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useMutation } from '@tanstack/react-query';

interface WithdrawalParams {
  address: string;
  coin: string;
  amount: number;
  password: string;
  confirm: boolean;
}

async function postWithdrawalRequest(payload: WithdrawalParams): Promise<any> {
  const res = await axios.post(`/withdrawals`, payload);
  return res.data.data;
}

export function useWithdraw() {
  return useMutation({
    mutationFn: postWithdrawalRequest,
    mutationKey: ['withdraw_referral_invite'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}