import type { Job } from '@/lib/types';
import { axios, ApiError, ApiResponse } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useMutation, useQuery } from '@tanstack/react-query';

// Create Job
interface CreateJobParams {
  name: string;
  category: string;
  paymentFee: number;
  description: string;
  isPrivate: boolean;
  deliveryDate: string;
  tags?: string[];
  attachments?: string[];
  deliverables: string[];
}

async function postCreateJob(params: CreateJobParams): Promise<Job> {
  const res = await axios.post('/collection', {
    ...params,
    type: 'job',
    deliverables: undefined,
  });
  return res.data.data;
}

export function useCreateJob() {
  const assignJobDeliverables = useAssignJobDeliverables();

  return useMutation({
    mutationFn: postCreateJob,
    mutationKey: ['create-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: ({ _id, name }, { deliverables = [] }) => {
      assignJobDeliverables.mutate({
        jobId: _id,
        deliverables,
      });
      toast.success(`Job ${name} created successfully`);
    },
  });
}

// Get Jobs

interface GetJobsParams {
  page?: number;
  limit?: number;
  category: 'open' | 'created' | 'assigned';
  status?: 'pending' | 'ongoing' | 'completed' | 'cancelled';
}

interface GetJobsResponse {
  limit: number;
  page: number;
  pages: number;
  total: number;
  data: Job[];
}

async function getJobs(params: GetJobsParams): Promise<GetJobsResponse> {
  const res = await axios.get('/collection', {
    params: {
      type: 'job',
      creator: params.category === 'created' ? true : undefined,
      isPrivate: params.category === 'open' ? false : undefined,
      receiver: params.category === 'assigned' ? true : undefined,
      status: params.status,
    },
  });
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

// Update Job
interface UpdateJobParams {
  id: string;
  name: string;
  category: string;
  paymentFee: number;
  description: string;
  tags?: string[];
  isPrivate: boolean;
  deliveryDate: string;
  deliverables: string[];
  attachments?: string[];
}

async function postUpdateJob(params: UpdateJobParams): Promise<Job> {
  const res = await axios.patch(`/collection/${params.id}`, {
    ...params,
    type: 'job',
    id: undefined,
    deliverables: undefined,
  });
  return res.data.data;
}

export function useUpdateJob() {
  const updateJobDeliverables = useAssignJobDeliverables();

  return useMutation({
    mutationFn: postUpdateJob,
    mutationKey: ['update-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (_, { deliverables = [], id, name }) => {
      updateJobDeliverables.mutate({
        jobId: id,
        deliverables,
        replace: true,
      });
      toast.success(`Job ${name} updated successfully`);
    },
  });
}

// Assign Job Deliverables

interface AssignJobDeliverablesParams {
  jobId: string;
  replace?: boolean;
  deliverables: string[];
}

async function postAssignJobDeliverables(params: AssignJobDeliverablesParams): Promise<any> {
  const deliverables = params.deliverables.map((deliverable) => ({
    name: deliverable,
    description: deliverable,
  }));

  const res = await axios.post(`/collection/many`, {
    parent: params.jobId,
    type: 'deliverable',
    replace: params.replace,
    collections: deliverables,
  });
  return res.data.data;
}

export function useAssignJobDeliverables() {
  return useMutation({
    mutationFn: postAssignJobDeliverables,
    mutationKey: ['assign-job-deliverables'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'Assigning deliverables failed');
    },
  });
}

// Apply to an open job
// TODO

// Assign job to talent
// TODO

// Invite talent to a job
interface InviteTalentToJobParams {
  jobId: string;
  talentId: string;
}

async function postInviteTalentToJob(params: InviteTalentToJobParams): Promise<ApiResponse> {
  const res = await axios.post(`/invite`, {
    collection: params.jobId,
    recipient: params.talentId,
  });
  return res.data.data;
}

export function useInviteTalentToJob() {
  return useMutation({
    mutationFn: postInviteTalentToJob,
    mutationKey: ['invite-talent-to-private-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Talent invited successfully');
    },
  });
}

// Accept a private job invite

interface AcceptPrivateJobInviteParams {
  inviteId: string;
}

async function postAcceptPrivateJobInvite(params: AcceptPrivateJobInviteParams): Promise<ApiResponse> {
  const res = await axios.post(`/invite/${params.inviteId}/accept`);
  return res.data.data;
}

export function useAcceptPrivateJobInvite() {
  return useMutation({
    mutationFn: postAcceptPrivateJobInvite,
    mutationKey: ['accept-private-job-invite'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Invite accepted successfully');
    },
  });
}

// Decline a private job invite

interface DeclinePrivateJobInviteParams {
  inviteId: string;
}

async function postDeclinePrivateJobInvite(params: DeclinePrivateJobInviteParams): Promise<ApiResponse> {
  const res = await axios.post(`/invite/${params.inviteId}/decline`);
  return res.data.data;
}

export function useDeclinePrivateJobInvite() {
  return useMutation({
    mutationFn: postDeclinePrivateJobInvite,
    mutationKey: ['decline-private-job-invite'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Invite declined successfully');
    },
  });
}

// OPEN JOBS

// Apply to an open job

interface ApplyToOpenJobParams {
  bid: number;
  jobId: string;
  message: string;
}

async function postApplyToOpenJob(params: ApplyToOpenJobParams): Promise<ApiResponse> {
  const res = await axios.post(`/bid`, {
    bid: params.bid,
    collection: params.jobId,
    message: params.message,
  });
  return res.data.data;
}

export function useApplyToOpenJob() {
  return useMutation({
    mutationFn: postApplyToOpenJob,
    mutationKey: ['apply-to-open-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Applied to job successfully');
    },
  });
}

// Post Job Payment Details

interface PostJobPaymentDetailsParams {
  jobId: string;
  coin: 'AVAX' | 'USDC';
}

interface PostJobPaymentDetailsResponse {
  rate: number;
  usdFee: number;
  address: string;
  usdAmount: number;
  amountToPay: number;
  expectedFee: number;
  feePercentage: number;
  collectionAmount: number;
}

async function postJobPaymentDetails(params: PostJobPaymentDetailsParams): Promise<PostJobPaymentDetailsResponse> {
  const res = await axios.post(`/payment`, {
    coin: params.coin,
    collection: params.jobId,
  });
  return res.data.data;
}

export function usePostJobPaymentDetails() {
  return useMutation({
    mutationFn: postJobPaymentDetails,
    mutationKey: ['get-job-payment-details'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'An error occurred');
    },
  });
}

// Confirm Job Payment

interface ConfirmJobPaymentParams {
  jobId: string;
}

async function postConfirmJobPayment(params: ConfirmJobPaymentParams): Promise<ApiResponse> {
  // delay for 10 seconds
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const res = await axios.post(`/payment/validate`, {
    collection: params.jobId,
  });
  return res.data.data;
}

export function useConfirmJobPayment() {
  return useMutation({
    mutationFn: postConfirmJobPayment,
    mutationKey: ['confirm-job-payment'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'An error occurred');
    },
    onSuccess: () => {
      toast.success('Payment confirmed successfully');
    },
  });
}
