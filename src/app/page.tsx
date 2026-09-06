"use client";

import StatusHUD from "@/components/StatusHUD";
import LevelCard from "@/components/LevelCard";
import { getTiers, getLevelsByTier, getLevelIndex } from "@/lib/levels";
import { useGameStore } from "@/store/useGameStore";

export default function Home() {
  // Selecting `completed` itself (not the `isCompleted` method reference,
  // which never changes) so this component re-renders when progress data
  // changes — e.g. when the persisted store rehydrates after mount.
  const completed = useGameStore((s) => s.completed);
  const isCompleted = (id: string) => !!completed[id];
  const tiers = getTiers();

  // Zero-friction entry: Level 1 is always unlocked. Every later level unlocks
  // only once the previous one in the ordered list is completed.
  const allLevels = tiers.flatMap((t) => getLevelsByTier(t));

  return (
    <main>
      <StatusHUD />
      <div className="mx-auto max-w-2xl space-y-10 p-4">
        {tiers.map((tier) => (
          <section key={tier}>
            <h2 className="mb-3 text-lg font-extrabold text-quest-yellow">{tier}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {getLevelsByTier(tier).map((level) => {
                const idx = getLevelIndex(level.id);
                const prev = allLevels[idx - 1];
                const locked = idx > 0 && !!prev && !isCompleted(prev.id);
                return <LevelCard key={level.id} level={level} locked={locked} />;
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
