"use client";

import { Trophy, Zap, Shield, Crown } from "lucide-react";
import Modal from "./Modal";
import { useGameStore } from "@/store/useGameStore";

const LEAGUES = [
  { name: "Bronze", min: 0, color: "text-amber-600", bg: "bg-amber-600/10 border-amber-600/30" },
  { name: "Silver", min: 150, color: "text-slate-300", bg: "bg-slate-300/10 border-slate-300/30" },
  { name: "Gold", min: 400, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  { name: "Platinum", min: 800, color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/30" },
];

function currentLeague(xp: number) {
  let current = LEAGUES[0];
  let next: (typeof LEAGUES)[number] | null = null;
  for (const league of LEAGUES) {
    if (xp >= league.min) current = league;
    else {
      next = league;
      break;
    }
  }
  return { current, next };
}

export default function LeagueModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const xp = useGameStore((s) => s.xp);
  const { current, next } = currentLeague(xp);

  return (
    <Modal open={open} onClose={onClose} title="League Standings" maxWidth="max-w-md">
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/30">
          <Trophy size={34} />
        </div>
        <h3 className="mt-3 text-2xl font-black text-white">{current.name} League</h3>
        <span className="mt-0.5 text-xs font-bold text-sky-400">{xp} Total XP Accumulated</span>
      </div>

      {next ? (
        <div className="mt-4 rounded-2xl border border-white/5 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
            <span>Next: {next.name}</span>
            <span className="text-sky-400">{next.min - xp} XP needed</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(5, ((xp - current.min) / (next.min - current.min)) * 100))}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-3 text-xs font-bold text-yellow-300">
          <Crown size={16} />
          <span>You&apos;ve ascended to the legendary Platinum League!</span>
        </div>
      )}

      {/* Tier Roadmap List */}
      <div className="mt-5 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          League Ranks
        </span>
        <div className="grid grid-cols-2 gap-2">
          {LEAGUES.map((league) => {
            const isCurrent = league.name === current.name;
            const isUnlocked = xp >= league.min;

            return (
              <div
                key={league.name}
                className={`flex items-center justify-between rounded-xl border p-2.5 transition ${
                  isCurrent
                    ? `${league.bg} ring-2 ring-sky-400/50 shadow-sm`
                    : isUnlocked
                    ? "border-white/10 bg-slate-800/40 text-slate-300"
                    : "border-white/5 bg-slate-900/40 opacity-40 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield size={16} className={league.color} />
                  <span className="text-xs font-bold">{league.name}</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-slate-400">
                  {league.min}+ XP
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
