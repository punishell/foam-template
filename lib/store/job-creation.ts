import { create } from 'zustand';

export type JobCreationSteps = 'details' | 'deliverables' | 'project' | 'visibility' | 'review';

type State = {
  jobDetails: {
    title?: string;
    dueDate?: string;
    category?: string;
    description?: string;
    skillSets?: string[];
    proposedPrice?: number;
    deliverables?: string[];
    type?: 'freelance' | 'project';
    visibility?: 'public' | 'private';
  };
  activeStep: JobCreationSteps;
  stepsStatus: Record<JobCreationSteps, 'pending' | 'active' | 'complete'>;
};

type Actions = {
  resetJobDetails: () => void;
  setActiveStep: (step: State['activeStep']) => void;
  setJobDetails: ({ job }: { job: State['jobDetails'] }) => void;
  setStepsStatus: (payload: Partial<State['stepsStatus']>) => void;
};

export const useJobCreationStore = create<State & Actions>((set, get) => ({
  jobDetails: {
    title: '',
    dueDate: '',
    category: '',
    skillSets: [],
    proposedPrice: 0,
    deliverables: [],
    description: '',
    type: 'freelance',
    visibility: 'public',
  },
  activeStep: 'details',
  stepsStatus: {
    details: 'active',
    review: 'pending',
    project: 'pending',
    visibility: 'pending',
    deliverables: 'pending',
  },
  setStepsStatus: (payload) => {
    set((state) => ({
      stepsStatus: {
        ...state.stepsStatus,
        ...payload,
      },
    }));
  },
  resetJobDetails: () => set({}),
  setActiveStep: (step) => set({ activeStep: step }),
  setJobDetails: ({ job }) => set({ jobDetails: { ...get().jobDetails, ...job } }),
}));
