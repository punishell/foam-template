import { create } from 'zustand';

export type JobCreationSteps = 'details' | 'deliverables' | 'project' | 'visibility' | 'review';

type State = {
  job: {
    due?: string;
    title?: string;
    budget?: number;
    category?: string;
    skills?: string[];
    description?: string;
    deliverables?: string[];
    type?: 'freelance' | 'project';
    visibility?: 'public' | 'private';
  };
  activeStep: JobCreationSteps;
  stepsStatus: Record<JobCreationSteps, 'pending' | 'active' | 'complete'>;
};

type Actions = {
  resetJob: () => void;
  setJob: (job: State['job']) => void;
  setActiveStep: (step: State['activeStep']) => void;
  setStepsStatus: (payload: Partial<State['stepsStatus']>) => void;
};

export const useJobCreationStore = create<State & Actions>((set, get) => ({
  job: {
    title: '',
    dueDate: '',
    category: '',
    skillSets: [],
    proposedPrice: 0,
    deliverables: [],
    description: '',
    jobType: 'freelance',
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
  resetJob: () => set({}),
  setActiveStep: (step) => set({ activeStep: step }),
  setJob: (job) => set({ job: { ...get().job, ...job } }),
}));
