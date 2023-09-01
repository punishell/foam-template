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
      skillIds: [],
      availability: string,
      skills: [],
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
      skills?: string[];
    };
    privateEarnings?: boolean;
    privateInvestments?: boolean;
  };
  socials?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
}

async function postUpdateAccount(values: UpdateAccountParams): Promise<User> {
  const res = await axios.patch('/account/update', values);
  return res.data.data;
}

export function useUpdateAccount() {
  return useMutation({
    mutationFn: postUpdateAccount,
    mutationKey: ['update-account'],
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
