import { FoodEntry } from './types';

/**
 * Groups food entries into "plates" by their logged hour and minute.
 * Entries with the same hour+minute form a single plate.
 */
export function groupIntoPlates(entries: FoodEntry[]): FoodEntry[][] {
  const byTime = new Map<string, FoodEntry[]>();

  for (const entry of entries) {
    const key = `${entry.hour ?? '0'}:${entry.minute ?? '0'}`;
    if (!byTime.has(key)) {
      byTime.set(key, []);
    }
    byTime.get(key)!.push(entry);
  }

  // Sort plates by time ascending
  const sortedKeys = [...byTime.keys()].sort();
  return sortedKeys.map((k) => byTime.get(k)!);
}