import { create } from 'zustand';
import { User } from '@/lib/types';

type UserState = User & {
  setUser: (user: User) => void;
};

export const useUserState = create<UserState>()((set) => ({
  _id: '',
  type: '',
  email: '',
  lastName: '',
  firstName: '',
  score: 0,
  profileImage: {
    url: '',
  },
  profileCompleteness: 0,
  profile: {
    talent: {
      tagIds: [],
      availability: '',
      tags: [],
    },
  },
  twoFAStatus: false,
  twoFAType: '',
  setUser: (user: User) => set(user),
}));
