"use client";

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
    <Modal open={open} onClose={onClose} title="Coins">
      <div className="text-center text-3xl font-extrabold text-quest-yellow">🪙 {coins}</div>
      <ul className="mt-4 space-y-2 text-sm text-white/80">
        <li>• +10 coins for completing any lesson</li>
        <li>• +20 coins for a perfect lesson (no hints used)</li>
      </ul>
      <button
        onClick={() => {
          onClose();
          onOpenWardrobe();
        }}
        className="mt-5 w-full rounded-2xl border-b-4 border-quest-blueDark bg-quest-blue px-4 py-2 font-extrabold active:border-b-0 active:translate-y-1"
      >
        Open Wardrobe
      </button>
    </Modal>
  );
}
