export type WardrobeCategory = "hat" | "outfit" | "accessory";

export interface WardrobeItem {
  id: string;
  category: WardrobeCategory;
  name: string;
  price: number;
}

export const WARDROBE_ITEMS: WardrobeItem[] = [
  { id: "hat-none", category: "hat", name: "No Hat", price: 0 },
  { id: "hat-cap", category: "hat", name: "Backwards Cap", price: 100 },
  { id: "hat-wizard", category: "hat", name: "Wizard Hat", price: 200 },
  { id: "hat-crown", category: "hat", name: "Golden Crown", price: 300 },

  { id: "outfit-base", category: "outfit", name: "Classic Tee", price: 0 },
  { id: "outfit-hoodie", category: "outfit", name: "Dev Hoodie", price: 150 },
  { id: "outfit-robe", category: "outfit", name: "Coder's Robe", price: 250 },

  { id: "accessory-none", category: "accessory", name: "None", price: 0 },
  { id: "accessory-glasses", category: "accessory", name: "Nerd Glasses", price: 100 },
  { id: "accessory-scarf", category: "accessory", name: "Cozy Scarf", price: 150 },
  { id: "accessory-badge", category: "accessory", name: "Champion Badge", price: 300 },
];

export const DEFAULT_OWNED_ITEM_IDS = ["hat-none", "outfit-base", "accessory-none"];
