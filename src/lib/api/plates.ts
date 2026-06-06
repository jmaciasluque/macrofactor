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

function rangeFromTo(low: number, high: number): number[] {
  const result: number[] = [];
  for (let i = low; i <= high; i++) result.push(i);
  return result;
}

export function timelineHours(plates: Plate[]): number[] {
  if (plates.length === 0) return rangeFromTo(6, 21);
  const hours = plates.map((p) => Number(p.hour));
  const low = Math.max(0, Math.min(...hours) - 1);
  const high = Math.min(23, Math.max(...hours) + 1);
  return rangeFromTo(low, high);
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
