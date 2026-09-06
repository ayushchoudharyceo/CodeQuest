"use client";

import Modal from "./Modal";
import { useGameStore } from "@/store/useGameStore";

const LEAGUES = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 150 },
  { name: "Gold", min: 400 },
  { name: "Platinum", min: 800 },
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
  // Stands in for "weekly XP" — a real weekly reset needs a backend cron job
  // this frontend-only demo doesn't have, so all-time XP is used instead.
  const xp = useGameStore((s) => s.xp);
  const { current, next } = currentLeague(xp);

  return (
    <Modal open={open} onClose={onClose} title="League">
      <div className="text-center">
        <div className="text-4xl">🏆</div>
        <p className="mt-2 text-xl font-extrabold text-quest-blue">{current.name} League</p>
        <p className="text-sm text-white/60">{xp} XP this season</p>
      </div>

      {next ? (
        <div className="mt-5">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-quest-blue"
              style={{
                width: `${Math.min(100, ((xp - current.min) / (next.min - current.min)) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-white/60">
            {next.min - xp} XP to reach {next.name}
          </p>
        </div>
      ) : (
        <p className="mt-5 text-center text-xs text-quest-yellow">You&apos;ve reached the top league!</p>
      )}
    </Modal>
  );
}
