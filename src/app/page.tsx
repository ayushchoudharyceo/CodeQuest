"use client";

import Link from "next/link";
import { Sparkles, Play, Award, Compass, BookOpen, Layers, Terminal, ChevronRight } from "lucide-react";
import StatusHUD from "@/components/StatusHUD";
import LevelCard from "@/components/LevelCard";
import { getTiers, getLevelsByTier, getLevelIndex, levels } from "@/lib/levels";
import { useGameStore } from "@/store/useGameStore";

const TIER_ICONS: Record<string, any> = {
  "Tier 1: Foundations": BookOpen,
  "Tier 2: Data & Functions": Layers,
  "Tier 3: OOP & Architecture": Compass,
  "Tier 4: Production Systems": Terminal,
};

const TIER_COLORS: Record<string, { badge: string; border: string; bg: string }> = {
  "Tier 1: Foundations": {
    badge: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    border: "border-emerald-500/20",
    bg: "from-emerald-500/10 via-transparent to-transparent",
  },
  "Tier 2: Data & Functions": {
    badge: "text-sky-400 bg-sky-500/15 border-sky-500/30",
    border: "border-sky-500/20",
    bg: "from-sky-500/10 via-transparent to-transparent",
  },
  "Tier 3: OOP & Architecture": {
    badge: "text-purple-400 bg-purple-500/15 border-purple-500/30",
    border: "border-purple-500/20",
    bg: "from-purple-500/10 via-transparent to-transparent",
  },
  "Tier 4: Production Systems": {
    badge: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    border: "border-amber-500/20",
    bg: "from-amber-500/10 via-transparent to-transparent",
  },
};

export default function Home() {
  const completed = useGameStore((s) => s.completed);
  const isCompleted = (id: string) => !!completed[id];
  const tiers = getTiers();
  const allLevels = tiers.flatMap((t) => getLevelsByTier(t));

  const totalLevels = allLevels.length;
  const completedCount = Object.keys(completed).length;
  const percentComplete = Math.round((completedCount / totalLevels) * 100);

  // Find next unlocked, incomplete level for the "Continue Quest" CTA
  const nextUpLevel = allLevels.find((l) => !isCompleted(l.id)) || allLevels[0];

  return (
    <main className="min-h-screen pb-20">
      <StatusHUD />

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-10 sm:px-6">
        {/* Hero Quest Progress Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#131b26] to-[#0f1722] p-6 sm:p-8 shadow-2xl">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-400">
                <Sparkles size={13} />
                <span>Python Skill Tree</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Master Python, One Quest at a Time
              </h1>
              <p className="max-w-xl text-sm text-slate-300">
                Interactive puzzles, instant in-browser execution, and zero setup. Earn coins, customize your avatar, and climb the leagues!
              </p>

              {/* Progress bar */}
              <div className="pt-2 max-w-md space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Overall Mastery</span>
                  <span className="text-white">{completedCount} / {totalLevels} Levels ({percentComplete}%)</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-500"
                    style={{ width: `${Math.max(4, percentComplete)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Resume Button */}
            {nextUpLevel && (
              <div className="shrink-0">
                <Link
                  href={`/lesson/${nextUpLevel.id}`}
                  className="group flex items-center gap-3 rounded-2xl border-b-4 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 font-black text-white shadow-lg shadow-emerald-950/50 transition hover:brightness-110 active:border-b-0 active:translate-y-1"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100/80">
                      {completedCount === 0 ? "Begin Journey" : "Continue Quest"}
                    </span>
                    <span className="text-base font-extrabold">{nextUpLevel.title}</span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 group-hover:translate-x-1 transition-transform">
                    <Play size={18} className="fill-white" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Skill Tree Tiers */}
        <div className="space-y-12">
          {tiers.map((tier, tierIdx) => {
            const tierLevels = getLevelsByTier(tier);
            const tierCompleted = tierLevels.filter((l) => isCompleted(l.id)).length;
            const tierPercent = Math.round((tierCompleted / tierLevels.length) * 100);
            const Icon = TIER_ICONS[tier] || Compass;
            const theme = TIER_COLORS[tier] || TIER_COLORS["Tier 1: Foundations"];

            return (
              <section key={tier} className="relative space-y-4">
                {/* Tier Header Card */}
                <div className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border ${theme.border} bg-gradient-to-r ${theme.bg} p-4 glass-card`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-white shadow-inner">
                      <Icon size={20} className={theme.badge.split(" ")[0]} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black tracking-tight text-white">{tier}</h2>
                      <p className="text-xs text-slate-400">
                        {tierCompleted === tierLevels.length
                          ? "Tier Completed! All badges unlocked."
                          : `${tierLevels.length - tierCompleted} lesson${tierLevels.length - tierCompleted === 1 ? "" : "s"} remaining`}
                      </p>
                    </div>
                  </div>

                  {/* Tier Completion Pill */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-bold text-slate-400">
                      {tierCompleted} / {tierLevels.length}
                    </span>
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-quest-green transition-all"
                        style={{ width: `${tierPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Level Cards Grid */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {tierLevels.map((level) => {
                    const idx = getLevelIndex(level.id);
                    const prev = allLevels[idx - 1];
                    const locked = idx > 0 && !!prev && !isCompleted(prev.id);
                    return <LevelCard key={level.id} level={level} locked={locked} />;
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
