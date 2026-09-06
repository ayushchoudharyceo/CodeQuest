"use client";

import Modal from "./Modal";
import { useGameStore } from "@/store/useGameStore";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StreakModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const streak = useGameStore((s) => s.streak);
  const streakFreezes = useGameStore((s) => s.streakFreezes);

  // Approximates a 7-day heat-map from the running streak count, since only
  // the current streak length (not full daily history) is tracked today.
  const activeDays = Math.min(streak, 7);

  return (
    <Modal open={open} onClose={onClose} title="Your Streak">
      <div className="flex items-center justify-center gap-2 text-3xl font-extrabold text-orange-400">
        🔥 {streak}
        <span className="text-base font-bold text-white/60">day{streak === 1 ? "" : "s"}</span>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {DAY_LABELS.map((label, i) => {
          const active = i >= 7 - activeDays;
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`h-8 w-8 rounded-lg ${active ? "bg-orange-400" : "bg-white/10"}`} />
              <span className="text-[10px] text-white/50">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/5 p-3">
        <span className="text-sm text-white/80">🧊 Streak Freeze tokens</span>
        <span className="font-extrabold text-quest-blue">{streakFreezes}</span>
      </div>
      <p className="mt-2 text-xs text-white/50">
        A Streak Freeze protects your streak for one missed day.
      </p>
    </Modal>
  );
}
