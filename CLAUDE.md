# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

npm run lint         # ESLint + Prettier check
npm run format       # Auto-format with Prettier
npm run check        # Type-check with svelte-check

npm run test:unit    # Unit tests with Vitest
npm run test:e2e     # E2E tests with Playwright (requires build first)
npm run test         # Full test suite
```

## Architecture

**Local-first PWA** — no backend server. All data is stored in the browser's IndexedDB via Dexie. The app tracks UV exposure days for highline webbing pieces.

### Data Model (`src/lib/db.ts`)

Two IndexedDB tables:

- **Webbing** — a piece of webbing: `id`, `name`, `segmentNumber`, `length`, `purchaseDate`, `backlogDays`, `notes`
- **Rig** — a rigging event: `id`, `name`, `webbings` (array of `"name-lengthm#segment"` strings), `startDate`, `endDate`, `up` (1=active, 0=past)

Accumulated UV days per webbing = sum of rig durations (in days) for all rigs containing that webbing + `backlogDays`.

### Key Patterns

- **Reactive queries**: All pages use `liveQuery()` from Dexie — UI re-renders automatically when DB changes.
- **Client-only DB**: IndexedDB can't run server-side; guard DB calls with `browser` from `$app/environment` where needed.
- **No server actions**: Forms submit directly to Dexie (no SvelteKit `+page.server.ts` files).
- **Shared calculations**: `src/lib/webbingDays.ts` contains the days-rigged logic (`allWebbingDays`, `webbingDaysById`) used by both the webbing list and details pages.
- **Svelte 5 + Dexie**: Pass `$state.snapshot(value)` when writing reactive arrays/objects to Dexie to avoid `DataCloneError` from Proxy objects.
- **Routing**: Two main sections — `/webbing` (manage webbing inventory) and `/log` (manage rigs). Global bottom nav in `+layout.svelte`.

### Route Structure

```
/webbing              — list all webbings with accumulated days
/webbing/create       — add new webbing
/webbing/[webbingId]  — webbing detail with inline editing and total days
/log                  — hub page with active rigs and days up
/log/rigs             — past rigs (up=0)
/log/rigs/go          — create new rig
/log/rigs/[rigId]     — rig detail with inline editing and take down action
```

### Tech Stack

- **SvelteKit 2 + Svelte 5** with TypeScript
- **Tailwind CSS 4** + **Skeleton UI** (seafoam theme)
- **Dexie 4** for IndexedDB
- **Vitest** (unit, jsdom for client tests) + **Playwright** (E2E against port 4173)
