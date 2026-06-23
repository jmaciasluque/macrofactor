import { expect, it } from 'vitest';

import { groupIntoPlates, type Plate, timelineHours } from './plates';
import { FoodEntry } from './types';

const makePlate = (hour: number): Plate => ({ hour, minute: 0, entries: [], calories: 0, protein: 0, carbs: 0, fat: 0 });

it('groups entries with the same hour and minute into one plate', () => {
  const entries: FoodEntry[] = [
    new FoodEntry({ date: '2026-06-06', entryId: 'entry-1', hour: '12', minute: '30' }),
    new FoodEntry({ date: '2026-06-06', entryId: 'entry-2', hour: '12', minute: '30' }),
  ];

  expect(groupIntoPlates(entries).length).toBe(1);
});

it('sets plate calories to the sum of entries calories', () => {
  const entries: FoodEntry[] = [
    new FoodEntry({ date: '2026-06-06', entryId: 'entry-1', hour: '12', minute: '30', caloriesRaw: 125 }),
    new FoodEntry({ date: '2026-06-06', entryId: 'entry-2', hour: '12', minute: '30', caloriesRaw: 175 }),
  ];

  expect(groupIntoPlates(entries)[0].calories).toBe(300);
});

it('sets plate protein to the sum of entries protein', () => {
  const entries: FoodEntry[] = [
    new FoodEntry({ date: '2026-06-06', entryId: 'a', hour: '12', minute: '30', proteinRaw: 30 }),
    new FoodEntry({ date: '2026-06-06', entryId: 'b', hour: '12', minute: '30', proteinRaw: 45 }),
  ];

  expect(groupIntoPlates(entries)[0].protein).toBe(75);
});

it('sets plate carbs to the sum of entries carbs', () => {
  const entries: FoodEntry[] = [
    new FoodEntry({ date: '2026-06-06', entryId: 'a', hour: '12', minute: '30', carbsRaw: 50 }),
    new FoodEntry({ date: '2026-06-06', entryId: 'b', hour: '12', minute: '30', carbsRaw: 30 }),
  ];

  expect(groupIntoPlates(entries)[0].carbs).toBe(80);
});

it('sets plate fat to the sum of entries fat', () => {
  const entries: FoodEntry[] = [
    new FoodEntry({ date: '2026-06-06', entryId: 'a', hour: '12', minute: '30', fatRaw: 20 }),
    new FoodEntry({ date: '2026-06-06', entryId: 'b', hour: '12', minute: '30', fatRaw: 15 }),
  ];

  expect(groupIntoPlates(entries)[0].fat).toBe(35);
});

it('includes plate hours in the visible timeline', () => {
  expect(
    timelineHours([{ hour: 14, minute: 0, entries: [], calories: 0, protein: 0, carbs: 0, fat: 0 } as unknown as Plate])
  ).toContain(14);
});

it('starts the visible timeline at 6 AM when plates are empty', () => {
  expect(timelineHours([])[0]).toBe(6);
});

it('ends the visible timeline at 9 PM when plates are empty', () => {
  const h = timelineHours([]);

  expect(h[h.length - 1]).toBe(21);
});

it('includes the hour before a plate in the visible timeline', () => {
  expect(timelineHours([makePlate(4)])).toContain(3);
});

it('caps the visible timeline at hour 23', () => {
  const h = timelineHours([makePlate(23)]);

  expect(h[h.length - 1]).toBe(23);
});

it('returns sorted unique visible timeline hours', () => {
  const h = timelineHours([makePlate(14), makePlate(6), makePlate(14)]);

  expect(h).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
});
