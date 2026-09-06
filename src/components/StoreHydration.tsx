"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useUserStore } from "@/store/useUserStore";

/**
 * Both persisted stores use `skipHydration: true`, so their first client
 * render matches the server (defaults, no localStorage). This runs once
 * after mount to load the real saved data as a normal state update instead
 * of a hydration pass, which is what was causing the mismatch error.
 */
export default function StoreHydration() {
  useEffect(() => {
    useGameStore.persist.rehydrate();
    useUserStore.persist.rehydrate();
  }, []);

  return null;
}
