import { User } from '@/lib/types';
import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useUserState } from '../store/account';

interface GetAccountResponse {
  _id: string,
  type: string,
  email: string,
  lastName: string,
  firstName: string,
  score: 0,
  profileImage: {
    url: string,
  },
  profileCompleteness: 0,
  profile: {
    talent: {
      tagIds?: []
      availability: string,
      tags?: [],
      about: string,
    },
    bio: {
      title: string,
      description: string,
    },
    contact: {
      city: string,
      country: string,
    }
  }
  twoFa: {
    status?: boolean;
    type?: string;
  }
  isPrivate?: boolean,
}
interface UpdateAccountParams {
  username?: string;
  profile?: {
    contact?: {
      state?: string;
      city?: string;
      phone?: string;
      address?: string;
      country?: string;
    };
    bio?: {
      title?: string;
      description?: string;
    };
    talent?: {
      availability?: string;
      tags?: string[];
    };
  };
  isPrivate?: boolean;
}

interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

interface Initiate2FAParams {
  type: string;
}

interface ActivateDeactivate2FAParams {
  code: string;
  securityQuestion?: string;
}

interface Initiate2FAResponse {
  securityQuestions?: string[];
  qrCodeUrl?: string;
  secret?: string;
  type?: string;
}

async function postUpdateAccount(values: UpdateAccountParams): Promise<User> {
  const res = await axios.patch('/account/update', values);
  return res.data.data;
}

async function postChangePassword(values: ChangePasswordParams): Promise<any> {
  const res = await axios.put('/account/password/change', values);
  return res.data.data;
}

export function useUpdateAccount() {
  return useMutation({
    mutationFn: postUpdateAccount,
    mutationKey: ['update_account_system'],
    onSuccess: () => {
      toast.success('Account updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

async function fetchUserAccount(): Promise<User> {
  const res = await axios.get('/account');
  return res.data.data;
}

async function postInitiate2FA(values: Initiate2FAParams): Promise<Initiate2FAResponse> {
  const res = await axios.post('/account/initiate/2fa', values);
  return res.data.data;
}

async function postActivate2FA(values: ActivateDeactivate2FAParams): Promise<any> {
  const res = await axios.post('/account/activate/2fa', values);
  return res.data.data;
}

async function postDeActivate2FA(values: ActivateDeactivate2FAParams): Promise<any> {
  const res = await axios.post('/account/deactivate/2fa', values);
  return res.data.data;
}

async function postDeActivate2FAEmailInitiate(): Promise<any> {
  const res = await axios.post('/account/2fa/email');
  return res.data.data;
}

export const useGetAccount = () => {
  const { setUser } = useUserState();
  return useQuery({
    queryFn: fetchUserAccount,
    queryKey: ['account-details'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (user: GetAccountResponse) => {
      setUser(user);
      return user;
    },
  });
};


export function useChangePassword() {
  return useMutation({
    mutationFn: postChangePassword,
    mutationKey: ['change_password'],
    onSuccess: () => {
      toast.success('Account Password changed successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

export function useInitialize2FA() {
  return useMutation({
    mutationFn: postInitiate2FA,
    mutationKey: ['initialize_2fa_setup'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

export function useActivate2FA() {
  const { isFetching, refetch: fetchAccount } = useGetAccount();
  return useMutation({
    mutationFn: postActivate2FA,
    mutationKey: ['activate_2fa_setup'],
    onSuccess: async () => {
      if (!isFetching) await fetchAccount();
      toast.success('2FA successfully activated');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

export function useDeActivate2FA() {
  const { isFetching, refetch: fetchAccount } = useGetAccount();
  return useMutation({
    mutationFn: postDeActivate2FA,
    mutationKey: ['deactivate_2fa_setup'],
    onSuccess: async () => {
      if (!isFetching) await fetchAccount();
      toast.success('2FA successfully deactivated');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

export function useDeActivate2FAEmailInitiate() {
  return useMutation({
    mutationFn: postDeActivate2FAEmailInitiate,
    mutationKey: ['deactivate_email_2fa_setup'],
    onSuccess: () => {
      toast.success('Email 2FA Code successfully Sent');
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}