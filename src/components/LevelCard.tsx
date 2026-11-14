"use client";

import Link from "next/link";
import { Lock, CheckCircle2, Play, Sparkles, Crown } from "lucide-react";
import { Level } from "@/types/level";
import { useGameStore } from "@/store/useGameStore";

export default function LevelCard({ level, locked }: { level: Level; locked: boolean }) {
  const result = useGameStore((s) => s.completed[level.id]);
  const done = !!result;
  const isPerfect = result?.perfect;

  if (locked) {
    return (
      <div className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-[#121822]/60 p-4 opacity-50 transition">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              {level.id}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800/80 text-slate-500">
              <Lock size={13} />
            </div>
          </div>
          <h3 className="mt-2 text-base font-bold text-slate-400">
            {level.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            {level.concept}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-2.5 text-[11px] font-semibold text-slate-500">
          <span>{level.mechanic}</span>
          <span>+{level.xp} XP</span>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <Link
        href={`/lesson/${level.id}`}
        className="group relative flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-[#13221b]/60 to-[#121b24] p-4 shadow-sm transition hover:border-emerald-400/60 hover:shadow-glow-green hover:-translate-y-0.5 active:translate-y-0"
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-bold tracking-wider text-emerald-400/80 uppercase">
              {level.id}
            </span>
            <div className="flex items-center gap-1">
              {isPerfect && (
                <span title="Perfect run (no hints used)!" className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                  <Crown size={13} />
                </span>
              )}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/40">
                <CheckCircle2 size={16} />
              </div>
            </div>
          </div>
          <h3 className="mt-2 text-base font-extrabold text-white group-hover:text-emerald-300 transition">
            {level.title}
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            {level.concept}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-emerald-500/20 pt-2.5 text-[11px] font-semibold text-emerald-300">
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px]">
            {level.mechanic}
          </span>
          <span className="flex items-center gap-1 font-bold">
            <Sparkles size={11} className="text-amber-400" />
            Completed
          </span>
        </div>
      </Link>
    );
  }

  // Active / Ready to play
  return (
    <Link
      href={`/lesson/${level.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border-2 border-sky-500/70 bg-gradient-to-br from-sky-950/40 via-slate-900/90 to-[#141d2b] p-4 shadow-lg shadow-sky-500/10 transition hover:border-sky-400 hover:shadow-glow-blue hover:-translate-y-1 active:translate-y-0"
    >
      {/* Gentle glowing corner accent */}
      <div className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-extrabold tracking-wider text-sky-400 uppercase">
              {level.id}
            </span>
            <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300">
              NEXT UP
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/30 group-hover:scale-110 transition-transform">
            <Play size={15} className="ml-0.5 fill-white" />
          </div>
        </div>
        <h3 className="mt-2 text-base font-extrabold text-white group-hover:text-sky-300 transition">
          {level.title}
        </h3>
        <p className="mt-1 text-xs text-slate-300">
          {level.concept}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-sky-500/20 pt-2.5 text-[11px] font-bold text-sky-300">
        <span className="text-slate-400">{level.mechanic}</span>
        <span className="flex items-center gap-1 rounded-full bg-sky-500/20 px-2 py-0.5 text-sky-200">
          +{level.xp} XP
        </span>
      </div>
    </Link>
  );
}
