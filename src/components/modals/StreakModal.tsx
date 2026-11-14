"use client";

import { Flame, Shield } from "lucide-react";
import Modal from "./Modal";
import { useGameStore } from "@/store/useGameStore";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StreakModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const streak = useGameStore((s) => s.streak);
  const streakFreezes = useGameStore((s) => s.streakFreezes);

  // Approximates a 7-day heat-map from the running streak count
  const activeDays = Math.min(streak, 7);

  return (
    <Modal open={open} onClose={onClose} title="Daily Streak" maxWidth="max-w-sm">
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30">
          <Flame size={36} className="animate-pulse" />
        </div>
        <div className="mt-3 flex items-baseline gap-1.5 text-3xl font-black text-orange-400">
          <span>{streak}</span>
          <span className="text-base font-bold text-slate-400">day{streak === 1 ? "" : "s"}</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">Complete at least one lesson each day to build your streak!</p>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {DAY_LABELS.map((label, i) => {
          const active = i >= 7 - activeDays;
          return (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all ${
                  active
                    ? "bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/40"
                    : "border border-white/5 bg-slate-800/40 text-slate-600"
                }`}
              >
                {active ? "✓" : ""}
              </div>
              <span className="text-[10px] font-bold text-slate-400">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-sky-500/20 bg-sky-950/30 p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
            <Shield size={16} />
          </div>
          <span className="text-xs font-bold text-slate-200">Streak Freezes</span>
        </div>
        <span className="font-mono text-base font-black text-sky-400">{streakFreezes}</span>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-500">
        A Streak Freeze protects your streak for one missed day.
      </p>
    </Modal>
  );
}
