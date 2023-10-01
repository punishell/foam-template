import type { Job } from '@/lib/types';
import { axios, ApiError, ApiResponse } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  const assignJobDeliverables = useAttachDeliverablesToJob();

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
      toast.error(error?.response?.data.message ?? 'An error occurred');
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
  const updateJobDeliverables = useAttachDeliverablesToJob();

  return useMutation({
    mutationFn: postUpdateJob,
    mutationKey: ['update-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'An error occurred');
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

// Attach Deliverables to Job

interface AttachDeliverablesToJobParams {
  jobId: string;
  replace?: boolean;
  deliverables: string[];
}

async function postAttachDeliverablesToJob(params: AttachDeliverablesToJobParams): Promise<any> {
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

export function useAttachDeliverablesToJob() {
  return useMutation({
    mutationFn: postAttachDeliverablesToJob,
    mutationKey: ['assign-job-deliverables'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'Assigning deliverables failed');
    },
  });
}

// Mark Deliverable as Complete

interface MarkDeliverableAsCompleteParams {
  jobId: string;
  isComplete: boolean;
  deliverableId: string;
  totalDeliverables: number;
  completedDeliverables: number;
}

async function postMarkDeliverableAsComplete(params: MarkDeliverableAsCompleteParams): Promise<ApiResponse> {
  const res = await axios.patch(`/collection/${params.deliverableId}`, {
    progress: params.isComplete ? 100 : 0,
  });
  return res.data;
}

export function useMarkDeliverableAsComplete() {
  const updateJobProgress = useUpdateJobProgress();

  return useMutation({
    mutationFn: postMarkDeliverableAsComplete,
    mutationKey: ['mark-deliverable-as-complete'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Marking deliverable as complete failed');
    },
    onSuccess: (_, { completedDeliverables, jobId, totalDeliverables, isComplete }) => {
      const progressPercentage = (isComplete: boolean) => {
        if (isComplete) return ((completedDeliverables + 1) / totalDeliverables) * 100;
        else return ((completedDeliverables - 1) / totalDeliverables) * 100;
      };
      updateJobProgress.mutate({
        jobId,
        progress: Math.floor(progressPercentage(isComplete)),
      });
      toast.success(`Deliverable marked as ${isComplete ? 'complete' : 'incomplete'} successfully`);
    },
  });
}

// Update Job Progress

interface UpdateJobProgressParams {
  jobId: string;
  progress: number;
}

async function postUpdateJobProgress(params: UpdateJobProgressParams): Promise<ApiResponse> {
  const res = await axios.patch(`/collection/${params.jobId}`, {
    progress: params.progress,
  });
  return res.data.data;
}

export function useUpdateJobProgress() {
  const queryClient = useQueryClient();
  const jobsQuery = useGetJobs({ category: 'assigned' });

  return useMutation({
    mutationFn: postUpdateJobProgress,
    mutationKey: ['update-job-progress'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Updating job progress failed');
    },
    onSuccess: () => {
      jobsQuery.refetch();
      queryClient.refetchQueries(['get-job-by-id']);
    },
  });
}

// Mark Job as Complete

interface MarkJobAsCompleteParams {
  jobId: string;
}

async function postMarkJobAsComplete(params: MarkJobAsCompleteParams): Promise<ApiResponse> {
  const res = await axios.patch(`/collection/${params.jobId}`, {
    status: 'completed',
  });
  return res.data.data;
}

export function useMarkJobAsComplete() {
  const queryClient = useQueryClient();
  const jobsQuery = useGetJobs({ category: 'assigned' });

  return useMutation({
    mutationFn: postMarkJobAsComplete,
    mutationKey: ['mark-job-as-complete'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'Marking job as complete failed');
    },
    onSuccess: () => {
      jobsQuery.refetch();
      queryClient.refetchQueries(['get-job-by-id']);
      toast.success('Job marked as completed');
    },
  });
}

// Create Job Review

interface CreateJobReviewParams {
  jobId: string;
  rating: number;
  review: string;
  recipientId: string;
}

async function postCreateJobReview(params: CreateJobReviewParams): Promise<ApiResponse> {
  const res = await axios.post(`/reviews`, {
    review: params.review,
    rating: params.rating,
    collectionId: params.jobId,
    receiver: params.recipientId,
  });
  return res.data.data;
}

export function useCreateJobReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateJobReview,
    mutationKey: ['create-job-review'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      queryClient.refetchQueries(['get-job-by-id']);
      toast.success('Your review has been submitted successfully');
    },
  });
}

// Release Job Payment

interface ReleaseJobPaymentParams {
  jobId: string;
}

async function postReleaseJobPayment(params: ReleaseJobPaymentParams): Promise<ApiResponse> {
  const res = await axios.post(`/payment/release`, {
    collection: params.jobId,
  });
  return res.data.data;
}

export function useReleaseJobPayment() {
  const queryClient = useQueryClient();
  const jobsQuery = useGetJobs({ category: 'assigned' });

  return useMutation({
    mutationFn: postReleaseJobPayment,
    mutationKey: ['release-job-payment'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: () => {
      jobsQuery.refetch();
      queryClient.refetchQueries(['get-job-by-id']);
      toast.success('Payment released successfully');
    },
  });
}

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
      toast.error(error?.response?.data.message || 'An error occurred inviting talent');
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
  jobId: string;
  amount: number;
  message: string;
}

async function postApplyToOpenJob(params: ApplyToOpenJobParams): Promise<ApiResponse> {
  const res = await axios.post(`/collection`, {
    type: 'application',
    name: 'Application',
    description: params.message,
    parent: params.jobId,
    paymentFee: params.amount,
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
  delay?: number;
}

async function postConfirmJobPayment(params: ConfirmJobPaymentParams): Promise<ApiResponse> {
  await new Promise((resolve) => setTimeout(resolve, params.delay ?? 0));
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
interface DeleteJobParams {
  id: string;
}

async function postDeleteJob(params: DeleteJobParams): Promise<Job> {
  const res = await axios.delete(`/collection/${params.id}`);
  return res.data.data;
}

export function useDeleteJob() {
  return useMutation({
    mutationFn: postDeleteJob,
    mutationKey: ['delete-job'],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message ?? 'An error occurred');
    },
    onSuccess: () => {
      toast.success(`Job deleted successfully`);
    },
  });
}
