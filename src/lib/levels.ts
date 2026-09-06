import rawLevels from "../../data/levels.json";
import { Level } from "@/types/level";

export const levels: Level[] = rawLevels as Level[];

export function getLevelById(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}

export function getTiers(): string[] {
  return Array.from(new Set(levels.map((l) => l.tier)));
}

export function getLevelsByTier(tier: string): Level[] {
  return levels.filter((l) => l.tier === tier);
}

/** Index of a level within the full ordered list — used to gate progression. */
export function getLevelIndex(id: string): number {
  return levels.findIndex((l) => l.id === id);
}

/** The level immediately after the given one in the full ordered list, if any. */
export function getNextLevel(id: string): Level | undefined {
  const index = getLevelIndex(id);
  if (index === -1) return undefined;
  return levels[index + 1];
}
