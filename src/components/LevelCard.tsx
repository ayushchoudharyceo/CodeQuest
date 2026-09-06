"use client";

import Link from "next/link";
import { Lock, Check } from "lucide-react";
import { Level } from "@/types/level";
import { useGameStore } from "@/store/useGameStore";

export default function LevelCard({ level, locked }: { level: Level; locked: boolean }) {
  const done = useGameStore((s) => s.isCompleted(level.id));

  const base =
    "flex flex-col items-start gap-1 rounded-2xl border-b-4 px-4 py-3 w-full text-left transition active:border-b-0 active:translate-y-1";

  if (locked) {
    return (
      <div className={`${base} border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed`}>
        <Lock size={18} />
        <span className="font-bold">{level.title}</span>
      </div>
    );
  }

  return (
    <Link
      href={`/lesson/${level.id}`}
      className={`${base} ${
        done
          ? "border-quest-greenDark bg-quest-green text-white"
          : "border-quest-blueDark bg-quest-blue text-white hover:brightness-110"
      }`}
    >
      <span className="flex items-center gap-2 font-extrabold">
        {done && <Check size={18} />}
        {level.title}
      </span>
      <span className="text-xs opacity-90">{level.concept}</span>
      <span className="text-xs font-bold opacity-75">+{level.xp} XP</span>
    </Link>
  );
}
