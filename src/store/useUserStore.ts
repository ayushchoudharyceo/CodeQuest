"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useGameStore } from "./useGameStore";
import { WARDROBE_ITEMS, DEFAULT_OWNED_ITEM_IDS } from "@/lib/wardrobe";

export interface EquippedItems {
  hat: string;
  outfit: string;
  accessory: string;
}

interface UserProfile {
  name: string;
  email: string;
  provider: "google" | "email";
}

interface UserState {
  isSignedIn: boolean;
  profile: UserProfile | null;
  ownedItemIds: string[];
  equipped: EquippedItems;
  hasSeenSignInPrompt: boolean;

  signInWithGoogle: (name: string, email: string) => void;
  signInWithEmail: (email: string) => void;
  signOut: () => void;
  markSignInPromptSeen: () => void;
  /** Deducts coins via useGameStore and grants the item; false if coins are insufficient. */
  purchaseItem: (itemId: string) => boolean;
  equipItem: (itemId: string) => void;
}

const DEFAULT_EQUIPPED: EquippedItems = {
  hat: "hat-none",
  outfit: "outfit-base",
  accessory: "accessory-none",
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isSignedIn: false,
      profile: null,
      ownedItemIds: DEFAULT_OWNED_ITEM_IDS,
      equipped: DEFAULT_EQUIPPED,
      hasSeenSignInPrompt: false,

      // Mocked: this frontend-only demo has no Google OAuth client ID or
      // backend session exchange, so sign-in just flips local state. The
      // guest xp/coins/streak in useGameStore already live in localStorage,
      // so "reconciliation" here is a no-op — a real backend would instead
      // POST the guest snapshot to /api/v1/sync/claim-guest at this point.
      signInWithGoogle: (name, email) =>
        set({ isSignedIn: true, profile: { name, email, provider: "google" } }),

      signInWithEmail: (email) =>
        set({
          isSignedIn: true,
          profile: { name: email.split("@")[0], email, provider: "email" },
        }),

      signOut: () => set({ isSignedIn: false, profile: null }),

      markSignInPromptSeen: () => set({ hasSeenSignInPrompt: true }),

      purchaseItem: (itemId) => {
        const item = WARDROBE_ITEMS.find((i) => i.id === itemId);
        if (!item) return false;
        if (get().ownedItemIds.includes(itemId)) return true;
        if (!useGameStore.getState().spendCoins(item.price)) return false;
        set((state) => ({ ownedItemIds: [...state.ownedItemIds, itemId] }));
        return true;
      },

      equipItem: (itemId) => {
        const item = WARDROBE_ITEMS.find((i) => i.id === itemId);
        if (!item || !get().ownedItemIds.includes(itemId)) return;
        set((state) => ({ equipped: { ...state.equipped, [item.category]: itemId } }));
      },
    }),
    {
      name: "codequest-user-profile",
      storage: createJSONStorage(() => localStorage),
      // See useGameStore.ts — deferred to StoreHydration.tsx to avoid an
      // SSR/client hydration mismatch against localStorage.
      skipHydration: true,
    }
  )
);
