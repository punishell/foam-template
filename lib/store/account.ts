import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IUser {
  _id: string;
  type: string;
  email: string;
  lastName: string;
  firstName: string;
  score: number;
  profileCompleteness: number;
  profileImage?: {
    url: string;
  };
  profile: {
    contact?: {
      city?: string;
      state?: string;
      phone?: string;
      address?: string;
      country?: string;
    };
    bio?: {
      title?: string;
      description?: string;
    };
    talent: {
      availability: string;
      skills: string[];
      skillIds: any[];
      about?: string;
    };
  };
}

type UserState = IUser & {
  setUser: (user: IUser) => void;
};

export const useUserState = create<UserState>()(
  persist(
    (set) => ({
      _id: "",
      type: "",
      email: "",
      lastName: "",
      firstName: "",
      score: 0,
      profileImage: {
        url: "",
      },
      profileCompleteness: 0,
      profile: {
        talent: {
          skillIds: [],
          availability: "",
          skills: [],
        },
      },
      setUser: (user: IUser) => set(user),
    }),
    {
      name: "user",
    }
  )
);