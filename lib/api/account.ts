import { User } from '@/lib/types';
import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useUserState } from '../store/account';

interface GetAccountresponse {
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

export const useGetAccount = () => {
  const { setUser } = useUserState();
  return useQuery({
    queryFn: fetchUserAccount,
    queryKey: ['account-details'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (user: GetAccountresponse) => {
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