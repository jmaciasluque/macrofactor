import { FoodEntry } from './types';

export interface Plate {
  hour: string;
  minute: string;
  entries: FoodEntry[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function timelineHours(plates: Plate[]): number[] {
  if (plates.length === 0) return [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  return plates.map((p) => p.hour);
}

/**
 * Groups food entries into "plates" by their logged hour and minute.
 * Entries with the same hour+minute form a single plate.
 */
export function groupIntoPlates(entries: FoodEntry[]): Plate[] {
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
  return sortedKeys.map((k) => {
    const group = byTime.get(k)!;
    const [hour, minute] = k.split(':');
    return {
      hour,
      minute,
      entries: group,
      calories: group.reduce((sum, e) => sum + e.calories(), 0),
      protein: group.reduce((sum, e) => sum + e.protein(), 0),
      carbs: group.reduce((sum, e) => sum + e.carbs(), 0),
      fat: group.reduce((sum, e) => sum + e.fat(), 0),
    };
  });
}
