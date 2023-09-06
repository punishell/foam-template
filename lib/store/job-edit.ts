import { create } from 'zustand';

export type JobEditSteps = 'details' | 'deliverables' | 'project' | 'visibility' | 'review';

const STEPS: JobEditSteps[] = ['details', 'deliverables', 'project', 'visibility', 'review'];

type State = {
  job: {
    id: string;
    title: string;
    budget: string;
    category: string;
    skills: string[];
    description: string;
    due: Date | undefined;
    deliverables: string[];
    type: 'freelance' | 'project';
    visibility: 'public' | 'private';
  };
  activeStepIndex: number;
  activeStep: JobEditSteps;
  completedSteps: JobEditSteps[];
  isActiveStep: (step: JobEditSteps) => boolean;
  isCompletedStep: (step: JobEditSteps) => boolean;
};

type Actions = {
  resetJobEdit: () => void;
  setJob: (job: State['job']) => void;
  gotoNextStep: () => void;
  gotoStep: (step: JobEditSteps) => void;
};

export const useJobEditStore = create<State & Actions>((set, get) => ({
  job: {
    id: '',
    title: '',
    budget: '',
    skills: [],
    category: '',
    due: undefined,
    description: '',
    deliverables: [],
    type: 'freelance',
    visibility: 'public',
  },
  activeStepIndex: 0,
  activeStep: 'details',
  completedSteps: [],
  resetJobEdit: () => set({}),
  setJob: (job) => set({ job: { ...get().job, ...job } }),
  gotoNextStep: () => {
    // goes to the next step, sets the current step as completed and next step as active
    const { activeStepIndex, completedSteps } = get();

    if (activeStepIndex < STEPS.length - 1) {
      set({
        activeStepIndex: activeStepIndex + 1,
        activeStep: STEPS[activeStepIndex + 1],
        completedSteps: [...completedSteps, STEPS[activeStepIndex]],
      });
    }
  },
  gotoStep: (step) => {
    // goes to the step if it's completed or active
    const { completedSteps, activeStep } = get();
    if (completedSteps.includes(step) || activeStep === step) {
      set({ activeStep: step, activeStepIndex: STEPS.indexOf(step) });
    }
  },
  isActiveStep: (step) => get().activeStep === step,
  isCompletedStep: (step) => get().completedSteps.includes(step),
}));
