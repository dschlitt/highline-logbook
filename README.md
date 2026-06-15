# 🪢 Highline Logbook

A progressive web app for tracking highline webbing usage.
Following the main and backup failure at [CRG 2024](www.slacklineinternational.org/2024/08/highline-webbing-lifetime/) we’ve been reminded that tracking how many days our webbing has been rigged is safety critical. This app is an opiniated log book that should help a slackliner do that more easily. 
 
**Live app:** [highline-logbook.vercel.app](https://highline-logbook.vercel.app)

# WIP 
Still in development, use at your own risk. Do not trust it with your data yet. Import / Export not implemented, browser cache data coule be cleared deleting your log book, or updates could wipe your data too.

---

## Features

- **Webbing tracker** — log which webbings were used in each rig and track cumulative days across all sessions
- **Offline-first** — all data lives in IndexedDB via Dexie.js, no connection required
- **Installable PWA** — add to your home screen on iOS or Android

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | [SvelteKit](https://kit.svelte.dev/) (Svelte 5) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + [Skeleton UI](https://www.skeleton.dev/) |
| Local storage | [Dexie.js](https://dexie.org/) (IndexedDB wrapper) |
| Testing | Vitest + Playwright |
| Deployment | [Vercel](https://vercel.com) |

---

## Getting Started

```bash
git clone https://github.com/dschlitt/highline-logbook.git
cd highline-logbook
npm install
npm run dev
```

```bash
npm run build    # production build
npm run check    # type-check
npm run lint     # lint + format check
npm test         # unit + e2e
```

---

## Data & Privacy

All data is stored locally in your browser's IndexedDB. Nothing is sent to a server. Clearing browser data will delete your logbook.

---

## Roadmap

- [ ] Cloud backup / remote sync
- [ ] Export to CSV or PDF
- [ ] Gear retirement alerts based on usage thresholds
- [ ] Session / send logging

