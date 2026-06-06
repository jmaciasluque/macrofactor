import { expect, it } from 'vitest';

import { groupIntoPlates } from './plates';
import { FoodEntry } from './types';

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
