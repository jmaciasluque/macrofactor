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
