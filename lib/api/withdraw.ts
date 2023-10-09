import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGetWalletTxs } from './wallet';

interface WithdrawalParams {
  address: string;
  coin: string;
  amount: number;
  password: string;
  otp?: string;
}

async function postWithdrawalRequest(payload: WithdrawalParams): Promise<any> {
  const res = await axios.post(`/withdrawals`, payload);
  return res.data.data;
}

export function useWithdraw() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postWithdrawalRequest,
    mutationKey: ['withdraw_referral_invite'],
    onSuccess: (data) => {
      toast.success('Withdrawal Successful');
      queryClient.refetchQueries({ queryKey: ["wallet-tx-q", "10", "1"], });
      queryClient.refetchQueries({ queryKey: ["wallet-data-fetch"], });
      return data;
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}
