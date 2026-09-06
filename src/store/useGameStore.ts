"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LevelResult {
  levelId: string;
  perfect: boolean;
  completedAt: string;
}

interface GameState {
  xp: number;
  coins: number;
  streak: number;
  lastPlayedDate: string | null;
  completed: Record<string, LevelResult>;
  hintsUsed: Record<string, boolean>;
  streakFreezes: number;

  /** Records a level completion, awards XP/coins per the Rule_book economy, updates streak. */
  completeLevel: (levelId: string, baseXp: number, hintUsedThisLevel: boolean) => void;
  useHint: (levelId: string) => void;
  isCompleted: (levelId: string) => boolean;
  /** Deducts coins for a wardrobe purchase; returns false (no-op) if the balance is too low. */
  spendCoins: (amount: number) => boolean;
  resetProgress: () => void;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(dateStr: string) {
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10);
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 0,
      streak: 0,
      lastPlayedDate: null,
      completed: {},
      hintsUsed: {},
      streakFreezes: 1,

      useHint: (levelId) =>
        set((state) => ({ hintsUsed: { ...state.hintsUsed, [levelId]: true } })),

      isCompleted: (levelId) => !!get().completed[levelId],

      completeLevel: (levelId, baseXp, hintUsedThisLevel) => {
        const state = get();
        const alreadyDone = !!state.completed[levelId];
        const perfect = !hintUsedThisLevel;

        // Base Reward: 10 coins + 20 XP flat per lesson (per Rule_book/spec economy),
        // scaled slightly by the level's own XP weight; Perfect bonus adds +10 coins/+10 XP.
        const baseCoins = 10;
        const xpGain = alreadyDone ? 0 : baseXp;
        const coinGain = alreadyDone ? 0 : perfect ? baseCoins + 10 : baseCoins;
        const bonusXp = alreadyDone ? 0 : perfect ? 10 : 0;

        const today = todayStr();
        let newStreak = state.streak;
        if (state.lastPlayedDate !== today) {
          newStreak = state.lastPlayedDate && isYesterday(state.lastPlayedDate)
            ? state.streak + 1
            : 1;
        }

        set({
          xp: state.xp + xpGain + bonusXp,
          coins: state.coins + coinGain,
          streak: newStreak,
          lastPlayedDate: today,
          completed: {
            ...state.completed,
            [levelId]: { levelId, perfect, completedAt: new Date().toISOString() },
          },
        });
      },

      spendCoins: (amount) => {
        const state = get();
        if (state.coins < amount) return false;
        set({ coins: state.coins - amount });
        return true;
      },

      resetProgress: () =>
        set({
          xp: 0,
          coins: 0,
          streak: 0,
          lastPlayedDate: null,
          completed: {},
          hintsUsed: {},
          streakFreezes: 1,
        }),
    }),
    {
      name: "codequest-guest-profile", // localStorage key (swap for idb-keyval storage below)
      storage: createJSONStorage(() => localStorage),
      // Rehydration is triggered manually post-mount (see StoreHydration.tsx)
      // so the client's first render matches the server's, avoiding a
      // hydration mismatch against localStorage data the server can't see.
      skipHydration: true,
    }
  )
);
