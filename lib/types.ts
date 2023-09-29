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
  status: JobStatus;
  bookmarkId?: string;
  isBookmarked?: boolean;
  inviteAccepted: boolean;
  recipientCompletedJob: boolean;
  collections: Array<JobDeliverable>;
  payoutStatus: 'pending' | 'ongoing' | 'completed' | 'waiting' | 'cancelled';
}

interface UserProfile {
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
    talent: {};
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

interface JobDeliverable {
  _id: string;
  name: string;
  progress: number; // 0 or 100
  updatedAt: string;
  type: 'deliverable';
  description: string;
  status: 'pending' | 'ongoing' | 'completed';
}

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
  data: { _id: string; paymentFee: string; creator: User; owner?: User };
  description: string;
  isBookmarked: boolean;
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
