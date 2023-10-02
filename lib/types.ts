export interface User {
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
      availability?: string;
      tags?: string[];
      tagsIds?: { name: string; color: string }[];
      about?: string;
    };
  };
  twoFa: {
    status?: boolean;
    type?: string;
  };
  achievements?: AchievementProps[];
}

export interface Job {
  _id: string;
  name: string;
  createdAt: string;
  creator: UserProfile;
  category: string;
  progress: number; // 0 - 100
  isPrivate: boolean;
  deliveryDate: string;
  description: string;
  paymentFee: number;
  tags: {
    type: 'tags';
    name: string;
    color: string;
  }[];
  // talent assigned to the job
  owner?: UserProfile;
  ratings: Rating[] | null;
  tagsData: string[];
  invites: any[]; // TODO: add type
  invite: undefined | {
    _id: string;
    sender: string;
    receiver: string;
    status: string;
  };
  status: JobStatus;
  bookmarkId?: string;
  isBookmarked?: boolean;
  inviteAccepted: boolean;
  recipientCompletedJob: boolean;
  collections: Collection[];
  payoutStatus: 'pending' | 'ongoing' | 'completed' | 'waiting' | 'cancelled';
}

export interface UserProfile {
  _id: string;
  score: number;
  lastName: string;
  firstName: string;
  profileImage?: {
    url: string;
  };
  profile: {
    bio: {
      title: string;
      availability: string;
      tags: any[]; // TODO: add type
    };
    talent: {
      tags: string[];
      tagsIds?: { name: string; color: string }[];
    };
  };
}

export type JobStatus = 'pending' | 'ongoing' | 'completed' | 'waiting' | 'cancelled';

interface Rating {
  review: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  owner: UserProfile;
  receiver: UserProfile;
}

export type JobDeliverable = {
  _id: string;
  name: string;
  progress: number; // 0 or 100
  updatedAt: string;
  type: 'deliverable';
  description: string;
  status: 'pending' | 'ongoing' | 'completed';
};

export type JobApplicant = {
  createdAt: string;
  paymentFee: number;
  description: string;
  type: 'application';
  creator: UserProfile;
};

type Collection = JobDeliverable | JobApplicant;

export const isJobDeliverable = (collection: Collection): collection is JobDeliverable => {
  return collection.type === 'deliverable';
};

export const isJobApplicant = (collection: Collection): collection is JobApplicant => {
  return collection.type === 'application';
};

export interface ImageUp {
  file: File;
  preview: string;
  id: string;
  name: string;
  size: string;
}

export interface AchievementProps {
  type: string;
  value: string;
  total: string;
}
export interface DataFeedResponse {
  closed: boolean;
  createdAt?: string;
  updatedAt?: string;
  creator: User;
  data: { _id: string; paymentFee: string; creator: User; owner?: User; invite: string };
  description: string;
  isBookmarked?: boolean;
  bookmarkId?: string;
  isPublic?: boolean;
  owner: User;
  owners?: User[];
  title: string;
  type: string;
  _id: string;
}

export interface Bookmark {
  _id: string;
  type: string;
  owner?: User;
  data: Job;
  feed: DataFeedResponse;
}

export interface Review {
  _id: string;
  data: Job;
  owner: User;
  rating: number;
  receiver: User;
  review: string;
  createdAt?: string;
  updatedAt?: string;
}
