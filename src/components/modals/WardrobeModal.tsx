"use client";

import { useState } from "react";
import { Sparkles, ShoppingBag, Check } from "lucide-react";
import Modal from "./Modal";
import AvatarRenderer from "@/components/AvatarRenderer";
import { WARDROBE_ITEMS, WardrobeCategory } from "@/lib/wardrobe";
import { useUserStore } from "@/store/useUserStore";
import { useGameStore } from "@/store/useGameStore";

const CATEGORIES: { id: WardrobeCategory; label: string }[] = [
  { id: "hat", label: "Hats" },
  { id: "outfit", label: "Outfits" },
  { id: "accessory", label: "Accessories" },
];

export default function WardrobeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [category, setCategory] = useState<WardrobeCategory>("hat");
  const equipped = useUserStore((s) => s.equipped);
  const ownedItemIds = useUserStore((s) => s.ownedItemIds);
  const purchaseItem = useUserStore((s) => s.purchaseItem);
  const equipItem = useUserStore((s) => s.equipItem);
  const coins = useGameStore((s) => s.coins);

  const items = WARDROBE_ITEMS.filter((i) => i.category === category);

  return (
    <Modal open={open} onClose={onClose} title="Avatar Wardrobe" maxWidth="max-w-md">
      {/* Avatar Pedestal Showcase */}
      <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-b from-slate-800/40 to-slate-900/60 p-5 shadow-inner">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-950/80 ring-4 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
          <AvatarRenderer equipped={equipped} size={96} />
        </div>
        <div className="mt-3 flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-950/40 px-3.5 py-1 text-xs font-black text-yellow-300">
          <span>🪙 {coins} Coins Available</span>
        </div>
      </div>

      {/* Category Segmented Control */}
      <div className="mt-4 flex rounded-xl border border-white/10 bg-slate-900/80 p-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              category === c.id
                ? "bg-sky-500 text-white shadow-md shadow-sky-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 max-h-[42vh] overflow-y-auto pr-1">
        {items.map((item) => {
          const owned = ownedItemIds.includes(item.id);
          const isEquipped = equipped[item.category] === item.id;
          return (
            <div
              key={item.id}
              className={`group flex flex-col items-center rounded-2xl border p-3.5 text-center transition-all ${
                isEquipped
                  ? "border-emerald-500/60 bg-emerald-950/20 shadow-glow-green"
                  : "border-white/5 bg-slate-800/30 hover:border-white/20 hover:bg-slate-800/60"
              }`}
            >
              <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-900/80 p-1 flex items-center justify-center">
                <AvatarRenderer equipped={{ ...equipped, [item.category]: item.id }} size={56} />
              </div>
              <p className="mt-2 text-xs font-bold text-slate-200">{item.name}</p>

              <div className="mt-3 w-full">
                {isEquipped ? (
                  <span className="flex items-center justify-center gap-1 rounded-xl bg-emerald-500/20 py-1.5 text-[11px] font-black text-emerald-400 border border-emerald-500/40">
                    <Check size={12} /> Equipped
                  </span>
                ) : owned ? (
                  <button
                    onClick={() => equipItem(item.id)}
                    className="w-full rounded-xl border-b-2 border-sky-700 bg-sky-500 py-1.5 text-xs font-black text-white shadow-sm transition hover:brightness-110 active:border-b-0 active:translate-y-0.5"
                  >
                    Equip
                  </button>
                ) : (
                  <button
                    onClick={() => purchaseItem(item.id)}
                    disabled={coins < item.price}
                    className="w-full rounded-xl border-b-2 border-amber-600 bg-gradient-to-r from-amber-400 to-yellow-500 py-1.5 text-xs font-black text-slate-950 shadow-sm transition hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none active:border-b-0 active:translate-y-0.5"
                  >
                    {item.price} 🪙
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
