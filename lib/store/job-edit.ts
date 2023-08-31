import { create } from 'zustand';

export type JobEditSteps = 'details' | 'deliverables' | 'project' | 'visibility' | 'review';

type State = {
  job: {
    id: string;
    title: string;
    due: string;
    category: string;
    description: string;
    skills: string[];
    budget: number;
    deliverables: string[];
    type: 'freelance' | 'project';
    visibility: 'public' | 'private';
  };
  activeStep: JobEditSteps;
};

type Actions = {
  resetJobEdit: () => void;
  setJob: (job: State['job']) => void;
  setActiveStep: (step: State['activeStep']) => void;
};

export const useJobEditStore = create<State & Actions>((set, get) => ({
  job: {
    id: '',
    due: '',
    title: '',
    budget: 0,
    skills: [],
    category: '',
    description: '',
    deliverables: [],
    type: 'freelance',
    visibility: 'public',
  },
  activeStep: 'details',
  stepsStatus: {
    details: 'active',
    review: 'inactive',
    project: 'inactive',
    visibility: 'inactive',
    deliverables: 'inactive',
  },
  resetJobEdit: () => set({}),
  setActiveStep: (step) => set({ activeStep: step }),
  setJob: (job) => set({ job: { ...get().job, ...job } }),
}));
