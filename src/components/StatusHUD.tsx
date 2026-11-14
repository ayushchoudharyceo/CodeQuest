"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Coins, Zap, Sparkles, User, ShoppingBag } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { useUserStore } from "@/store/useUserStore";
import AvatarRenderer from "@/components/AvatarRenderer";
import SignInModal from "@/components/modals/SignInModal";
import WardrobeModal from "@/components/modals/WardrobeModal";
import StreakModal from "@/components/modals/StreakModal";
import CoinBalanceModal from "@/components/modals/CoinBalanceModal";
import LeagueModal from "@/components/modals/LeagueModal";

type ModalKind = "signIn" | "wardrobe" | "streak" | "coins" | "league" | null;

export default function StatusHUD() {
  const { streak, coins, xp } = useGameStore();
  const isSignedIn = useUserStore((s) => s.isSignedIn);
  const equipped = useUserStore((s) => s.equipped);
  const [openModal, setOpenModal] = useState<ModalKind>(null);
  const close = () => setOpenModal(null);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav shadow-md shadow-black/20">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition transform active:scale-95"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0c1117]">
              <Sparkles size={18} className="text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
              CodeQuest
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block -mt-1">
              Python Odyssey
            </span>
          </div>
        </Link>

        {/* Stats Pill Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-sm font-bold">
          {/* Streak Pill */}
          <button
            onClick={() => setOpenModal("streak")}
            title="Current Streak"
            className="group flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-950/30 px-2.5 py-1 text-orange-400 transition hover:bg-orange-900/40 hover:border-orange-500/50 hover:scale-105 active:scale-95"
          >
            <Flame
              size={18}
              className={`transition-transform duration-300 ${
                streak > 0 ? "text-orange-400 animate-pulse fill-orange-400/20" : "text-slate-500"
              }`}
            />
            <span className="font-extrabold tracking-tight">{streak}</span>
          </button>

          {/* Coins Pill */}
          <button
            onClick={() => setOpenModal("coins")}
            title="Coin Balance"
            className="group flex items-center gap-1.5 rounded-full border border-yellow-500/25 bg-yellow-950/30 px-2.5 py-1 text-yellow-300 transition hover:bg-yellow-900/40 hover:border-yellow-500/50 hover:scale-105 active:scale-95"
          >
            <Coins size={18} className="text-yellow-400 fill-yellow-400/20 transition-transform group-hover:rotate-12" />
            <span className="font-extrabold tracking-tight">{coins}</span>
          </button>

          {/* XP Pill */}
          <button
            onClick={() => setOpenModal("league")}
            title="XP & League Standings"
            className="group flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-950/30 px-2.5 py-1 text-sky-300 transition hover:bg-sky-900/40 hover:border-sky-500/50 hover:scale-105 active:scale-95"
          >
            <Zap size={18} className="text-sky-400 fill-sky-400/20 transition-transform group-hover:scale-110" />
            <span className="font-extrabold tracking-tight">{xp} <span className="text-[11px] opacity-75">XP</span></span>
          </button>

          {/* Wardrobe / Avatar / Sign In */}
          {isSignedIn ? (
            <button
              onClick={() => setOpenModal("wardrobe")}
              className="group relative ml-1 flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-slate-900/80 p-1 pr-2.5 text-xs font-bold text-emerald-300 shadow-sm transition hover:border-emerald-400 hover:shadow-glow-green active:scale-95"
              aria-label="Open wardrobe"
              title="Open Wardrobe"
            >
              <div className="overflow-hidden rounded-full ring-2 ring-emerald-400/60 group-hover:ring-emerald-300 transition">
                <AvatarRenderer equipped={equipped} size={28} />
              </div>
              <ShoppingBag size={14} className="text-emerald-400 opacity-80 group-hover:opacity-100 hidden sm:block" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => setOpenModal("wardrobe")}
                className="hidden sm:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:border-white/20 active:scale-95"
                title="View Wardrobe"
              >
                <ShoppingBag size={14} className="text-amber-400" />
                <span>Shop</span>
              </button>
              <button
                onClick={() => setOpenModal("signIn")}
                className="flex items-center gap-1.5 rounded-full border-b-2 border-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm shadow-emerald-950 transition hover:brightness-110 active:border-b-0 active:translate-y-0.5"
              >
                <User size={13} />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

    <SignInModal open={openModal === "signIn"} onClose={close} />
    <WardrobeModal open={openModal === "wardrobe"} onClose={close} />
    <StreakModal open={openModal === "streak"} onClose={close} />
    <CoinBalanceModal
      open={openModal === "coins"}
      onClose={close}
      onOpenWardrobe={() => setOpenModal("wardrobe")}
    />
    <LeagueModal open={openModal === "league"} onClose={close} />
  </>
);
}
