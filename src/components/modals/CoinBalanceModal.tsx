"use client";

import { Coins, Sparkles, ShoppingBag, CheckCircle2 } from "lucide-react";
import Modal from "./Modal";
import { useGameStore } from "@/store/useGameStore";

export default function CoinBalanceModal({
  open,
  onClose,
  onOpenWardrobe,
}: {
  open: boolean;
  onClose: () => void;
  onOpenWardrobe: () => void;
}) {
  const coins = useGameStore((s) => s.coins);

  return (
    <Modal open={open} onClose={onClose} title="Coin Balance" maxWidth="max-w-sm">
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-yellow-500/30">
          <Coins size={36} />
        </div>
        <div className="mt-3 text-3xl font-black text-yellow-300">
          🪙 {coins}
        </div>
        <span className="text-xs text-slate-400">CodeQuest Gold Currency</span>
      </div>

      <div className="mt-5 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          How to Earn
        </span>
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Complete any lesson</span>
            <span className="font-mono font-bold text-yellow-300">+10 coins</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-2">
            <span className="text-slate-300">Perfect run (no hints used)</span>
            <span className="font-mono font-bold text-amber-400">+20 coins</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onClose();
          onOpenWardrobe();
        }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-sky-700 bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-sky-950 transition hover:brightness-110 active:border-b-0 active:translate-y-1"
      >
        <ShoppingBag size={16} />
        <span>Open Wardrobe Shop</span>
      </button>
    </Modal>
  );
}
