import { useMutation, useQuery } from '@tanstack/react-query';
import { axios, ApiError, ApiResponse } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
// Create Job

interface CreateJobParams {
  type: 'job';
  name: string;
  category: string;
  paymentFee: number;
  description: string;
  isPrivate: boolean;
  deliveryDate: string;
  attachments: string[];
  skills: string[];
}

interface CreateJobResponse {
  id: string;
}

async function postCreateJob(params: CreateJobParams): Promise<CreateJobResponse> {
  const res = await axios.post('/collection', params);
  return res.data.data;
}

export function useCreateJob() {
  return useMutation({
    mutationFn: postCreateJob,
    mutationKey: ['create-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Job created successfully');
    },
  });
}

// Update Job

interface UpdateJobParams {
  jobId: string;
  type: 'job';
  name?: string;
  category?: string;
  paymentFee?: number;
  description?: string;
  isPrivate?: boolean;
  deliveryDate?: string;
  attachments?: string[];
  skills?: string[];
}

interface UpdateJobResponse {
  id: string;
}

async function postUpdateJob(params: UpdateJobParams): Promise<UpdateJobResponse> {
  const res = await axios.patch(`/collection/${params.jobId}`, params);
  return res.data.data;
}

export function useUpdateJob() {
  return useMutation({
    mutationFn: postUpdateJob,
    mutationKey: ['update-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Job updated successfully');
    },
  });
}

// Get Jobs

interface Job {
  _id: string;
  name: string;
  progress: number;
  type: 'freelance' | 'project';
  status: 'pending' | 'ongoing' | 'completed' | 'waiting' | 'cancelled';
  payoutStatus: 'pending' | 'ongoing' | 'completed' | 'waiting' | 'cancelled';
  recipientCompletedJob: boolean;
  category: string;
  description: string;
  isPrivate: boolean;
  paymentFee: number;
  inviteAccepted: boolean;
  deliveryDate: string;
  creator: {
    profile: {
      talent: {
        skills: string[];
        availability: string;
      };
    };
    _id: string;
    firstName: string;
    lastName: string;
    type: string;
    afroScore: number;
  };
  skills: {
    name: string;
    color: string;
  }[];
}

interface GetJobsParams {
  page?: number;
  limit?: number;
}

interface GetJobsResponse {
  page: number;
  total: number;
  limit: number;
  pages: number;
  data: Job[];
}

async function getJobs(params: GetJobsParams): Promise<GetJobsResponse> {
  const res = await axios.get('/collection', { params });
  return res.data.data;
}

export function useGetJobs(params: GetJobsParams) {
  return useQuery({
    queryFn: () => getJobs(params),
    queryKey: ['get-jobs', params],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}

// Get Job By Id

interface GetJobByIdParams {
  jobId: string;
}

interface GetJobByIdResponse extends Job {}

async function getJobById(params: GetJobByIdParams): Promise<GetJobByIdResponse> {
  const res = await axios.get(`/collection/${params.jobId}`);
  return res.data.data;
}

export function useGetJobById(params: GetJobByIdParams) {
  return useQuery({
    queryFn: () => getJobById(params),
    queryKey: ['get-job-by-id', params],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
  });
}
