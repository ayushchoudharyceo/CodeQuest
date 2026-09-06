"use client";

import { useState } from "react";
import { Flame, Coins, Zap } from "lucide-react";
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
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b-4 border-black/20 bg-quest-card px-4 py-3">
      <span className="text-lg font-extrabold text-quest-green">CodeQuest</span>
      <div className="flex items-center gap-2 text-white font-bold">
        <button
          onClick={() => setOpenModal("streak")}
          className="flex items-center gap-1 rounded-xl px-2 py-1 text-orange-400 transition hover:bg-white/10"
        >
          <Flame size={20} /> {streak}
        </button>
        <button
          onClick={() => setOpenModal("coins")}
          className="flex items-center gap-1 rounded-xl px-2 py-1 text-quest-yellow transition hover:bg-white/10"
        >
          <Coins size={20} /> {coins}
        </button>
        <button
          onClick={() => setOpenModal("league")}
          className="flex items-center gap-1 rounded-xl px-2 py-1 text-quest-blue transition hover:bg-white/10"
        >
          <Zap size={20} /> {xp} XP
        </button>

        {isSignedIn ? (
          <button
            onClick={() => setOpenModal("wardrobe")}
            className="ml-1 rounded-full ring-2 ring-quest-green transition hover:brightness-110"
            aria-label="Open wardrobe"
          >
            <AvatarRenderer equipped={equipped} size={32} />
          </button>
        ) : (
          <button
            onClick={() => setOpenModal("signIn")}
            className="ml-1 rounded-2xl border-b-4 border-quest-greenDark bg-quest-green px-3 py-1.5 text-sm font-extrabold active:border-b-0 active:translate-y-1"
          >
            Sign In
          </button>
        )}
      </div>

      <SignInModal open={openModal === "signIn"} onClose={close} />
      <WardrobeModal open={openModal === "wardrobe"} onClose={close} />
      <StreakModal open={openModal === "streak"} onClose={close} />
      <CoinBalanceModal
        open={openModal === "coins"}
        onClose={close}
        onOpenWardrobe={() => setOpenModal("wardrobe")}
      />
      <LeagueModal open={openModal === "league"} onClose={close} />
    </div>
  );
}
