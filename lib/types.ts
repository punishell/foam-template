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
      tagIds?: any[];
      about?: string;
    };
  };
}

export interface Job {
  _id: string;
  name: string;
  createdAt: string;
  creator: {
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
  };
  category: string;
  progress: number;
  isPrivate: boolean;
  deliveryDate: string;
  description: string;
  paymentFee: number;
  tags: {
    type: 'tags';
    name: string;
    color: string;
  }[];
  tagsData: string[];
  invites: any[]; // TODO: add type
  inviteAccepted: boolean;
  recipientCompletedJob: boolean;
  collections: Array<JobDeliverable>;
  status: 'pending' | 'ongoing' | 'completed' | 'waiting' | 'cancelled';
  payoutStatus: 'pending' | 'ongoing' | 'completed' | 'waiting' | 'cancelled';
}

interface JobDeliverable {
  _id: string;
  name: string;
  type: 'deliverable';
  description: string;
  status: 'pending' | 'ongoing' | 'completed';
}
