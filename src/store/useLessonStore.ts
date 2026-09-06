"use client";

import { create } from "zustand";
import { LessonStepData } from "@/types/lesson";

interface LessonSessionState {
  levelId: string | null;
  steps: LessonStepData[];
  currentStepIndex: number;
  passedSteps: boolean[];

  startLesson: (levelId: string, steps: LessonStepData[]) => void;
  markCurrentStepPassed: () => void;
  goToNextStep: () => void;
}

export const useLessonStore = create<LessonSessionState>((set) => ({
  levelId: null,
  steps: [],
  currentStepIndex: 0,
  passedSteps: [],

  startLesson: (levelId, steps) =>
    set({ levelId, steps, currentStepIndex: 0, passedSteps: steps.map(() => false) }),

  markCurrentStepPassed: () =>
    set((state) => {
      const passedSteps = [...state.passedSteps];
      passedSteps[state.currentStepIndex] = true;
      return { passedSteps };
    }),

  goToNextStep: () =>
    set((state) => ({
      currentStepIndex: Math.min(state.currentStepIndex + 1, state.steps.length - 1),
    })),
}));
