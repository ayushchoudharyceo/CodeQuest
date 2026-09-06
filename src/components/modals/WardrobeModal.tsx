"use client";

import { useState } from "react";
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
    <Modal open={open} onClose={onClose} title="Wardrobe" maxWidth="max-w-md">
      <div className="flex flex-col items-center gap-2">
        <AvatarRenderer equipped={equipped} size={96} />
        <span className="flex items-center gap-1 text-sm font-bold text-quest-yellow">
          🪙 {coins}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
              category === c.id ? "bg-quest-blue text-white" : "bg-white/10 text-white/60"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {items.map((item) => {
          const owned = ownedItemIds.includes(item.id);
          const isEquipped = equipped[item.category] === item.id;
          return (
            <div
              key={item.id}
              className="flex flex-col items-center rounded-2xl border-b-4 border-black/30 bg-white/5 p-3 text-center"
            >
              <AvatarRenderer equipped={{ ...equipped, [item.category]: item.id }} size={64} />
              <p className="mt-1 text-sm font-bold">{item.name}</p>
              {isEquipped ? (
                <span className="mt-2 inline-block rounded-xl bg-quest-green px-3 py-1 text-xs font-extrabold">
                  Equipped
                </span>
              ) : owned ? (
                <button
                  onClick={() => equipItem(item.id)}
                  className="mt-2 w-full rounded-xl border-b-4 border-quest-blueDark bg-quest-blue px-3 py-1 text-xs font-extrabold active:border-b-0 active:translate-y-1"
                >
                  Equip
                </button>
              ) : (
                <button
                  onClick={() => purchaseItem(item.id)}
                  disabled={coins < item.price}
                  className="mt-2 w-full rounded-xl border-b-4 border-yellow-700 bg-quest-yellow px-3 py-1 text-xs font-extrabold text-black disabled:opacity-40 active:border-b-0 active:translate-y-1"
                >
                  {item.price} 🪙
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
