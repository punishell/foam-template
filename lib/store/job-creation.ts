import { create } from 'zustand';

export type JobCreationSteps = 'details' | 'deliverables' | 'project' | 'visibility' | 'review';

const STEPS: JobCreationSteps[] = ['details', 'deliverables', 'project', 'visibility', 'review'];

type State = {
  job: {
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
  activeStep: JobCreationSteps;
  completedSteps: JobCreationSteps[];
  isActiveStep: (step: JobCreationSteps) => boolean;
  isCompletedStep: (step: JobCreationSteps) => boolean;
};

type Actions = {
  resetJobCreation: () => void;
  setJob: (job: State['job']) => void;
  gotoNextStep: () => void;
  gotoStep: (step: JobCreationSteps) => void;
};

export const useJobCreationStore = create<State & Actions>((set, get) => ({
  job: {
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
  completedSteps: [],
  activeStepIndex: 0,
  activeStep: 'details',
  resetJobCreation: () => set({}),
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
