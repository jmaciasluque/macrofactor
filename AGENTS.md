# MacroFactor

**Updated:** 2026-06-06 | **HEAD:** 7ddde52

SvelteKit 2 + Svelte 5 web app, Node.js CLI, and MCP server for the MacroFactor nutrition/workout tracker. Talks directly to MacroFactor's Firebase/Firestore backend (`sbs-diet-app`) — no custom server. SSR disabled; client-side auth via Firebase Identity Toolkit.

## Where Things Live

| Component | Entry Point | Notes |
| --------- | ----------- | ----- |
| Web app pages | `src/routes/{feature}/+page.svelte` | 8 feature pages + login + home |
| API client | `src/lib/api/client.ts` (1236 lines) | `MacroFactorClient` class |
| API deep-dive | `src/lib/api/AGENTS.md` | Firestore encoding, FoodEntry class, anti-patterns |
| CLI tool | `cli/mf.ts` (2110 lines) | 30+ commands, JSON in/out — see `cli/AGENTS.md` |
| MCP server | `src/mcp/stdio.ts` | 5 tool modules (food, nutrition, profile, weight, workout) |
| OpenCode MCP cfg | `.opencode/mcp.json` | Runs `npx tsx src/mcp/stdio.ts` |
| Auth | `src/lib/api/auth.ts` + `src/lib/stores/auth.svelte.ts` | Firebase Identity Toolkit, localStorage refresh token |
| Food search | `src/lib/api/typesense.ts` | Typesense multi-collection |
| Exercise DB | `data/exercises.json` (2.6MB, 4170 hex IDs) | Local lookup — `/exercises` Firestore returns 403 |
| Exercise resolution | `src/lib/api/exercises.ts` | `resolveName()` for bundled; `getCustomExercises()` for UUID-based |
| Sync | `src/lib/api/sync.ts` | `syncDayDashboard()` — polls Firestore for dashboard sync |
| Plates | `src/lib/api/plates.ts` | `groupIntoPlates()` — groups entries by logged time |
| Firestore schema | `docs/api-reference.md` | Field names, types, collections |

## Commands

```bash
pnpm install                  # Install deps
npm run dev                   # Vite dev server
npm run build                 # SvelteKit production build
npm run build:mcp             # tsup → dist/mcp/ (stdio.js + http.js)
npm run preview               # Preview production build
npm run format                # Prettier (120 chars, single quotes, 2-space, trailing commas ES5)
npm run format:check
npm run typecheck             # svelte-check (also runs svelte-kit sync)
npm run check                 # Alias for typecheck
npm run test                  # Vitest: cli/**/*.test.ts + src/**/*.test.ts
npm run test:watch
npx tsx cli/mf.ts <cmd>      # CLI (reads .env)
```

## CI Pipeline

`.github/workflows/ci.yml` — 4 parallel jobs on push/PR to `main`:
1. **check**: `format:check` → `typecheck`
2. **test**: `vitest run`
3. **build**: `npm run build` (SvelteKit) + `npm run build:mcp` (MCP server)
4. **release** (push only, after check+test+build pass): semantic-release → npm publish `@sjawhar/macrofactor-mcp`

Node 22 required (`engine-strict` in `.npmrc`). pnpm is primary (both lockfiles exist).

## Anti-Patterns (CRITICAL)

### Food Entries
- Numeric fields **MUST** be Firestore `stringValue` — use `sfv()`, `bfv()`, `nfv()` from `firestore.ts`. Native types crash the Android app for that entire day.
- `k` (source type) **MUST** be `"n"` — `"manual"` breaks the app's food log rendering.
- Entry IDs: `Date.now() * 1000` (microseconds). Never use meal time as ID — silent overwrites.
- Meal time: `h`/`mi` are wall-clock strings with NO timezone. Never round-trip through `Date`. Use `LogTime { date, hour, minute }`.
- Write: `logFood()` / `logSearchedFood()` — never `patchDocument()` directly. Partial update: `updateFoodEntryFields()` — never `patchFoodDocument()` (it replaces the entire entry).

### Workouts
- `workoutSource.runtimeType` **MUST** be `"program"` — `"trainingProgram"` crashes the app.
- `cycleIndex 999` for deload (when cycleIndex >= program's `numCycles`).
- Program-linked workouts need both target attachment + `markProgramDayCompleted()`.
- `getRawWorkout()` for writes (raw Firestore types); `getWorkout()` for reads (parsed, microseconds→seconds).
- Duration/rest: Firestore stores microseconds. `getWorkout()` returns seconds. Multiply × 1,000,000 for writes.

### Conventions
- **Svelte 5 runes**: `$state`, `$derived`, `$effect`, `$props` — no legacy `$:`.
- **No SSR**: `+layout.ts` exports `ssr = false`.
- **No `+server.ts`**: All API calls direct to Firebase/Typesense.
- **CSS**: Scoped `<style>` per component; global tokens in `src/app.css`.
- **Dark-only theme**: `#000` background, macro colors (blue=cal, red=protein, yellow=fat, green=carbs).
- **No ESLint**: TypeScript strict mode + svelte-check.
- **Weight**: kg internally. Convert lbs: `lbs / 2.2046226218`.
- **`.env`**: CLI has custom parser — never `source .env` (password has special chars).