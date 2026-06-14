---
name: run
description: Use when asked to run, start, preview, or screenshot HighlineLogBookLocal, or to verify a UI/PWA change (favicon, manifest, icons, pages, forms) actually works in a browser. Covers starting the Vite dev server or production preview and driving it headlessly with Playwright/Chromium.
---

# Running HighlineLogBookLocal

A local-first SvelteKit PWA — no backend, all data in IndexedDB via Dexie.
"Running" it means a real (headless) browser, since IndexedDB and
`liveQuery()` reactivity don't exist under `curl`.

## 1. Launch

**Dev server** (HMR, fastest iteration):

```bash
npm run dev -- --port 5180 > /tmp/vite-dev.log 2>&1 &
disown
timeout 30 bash -c 'until curl -sf http://localhost:5180 >/dev/null; do sleep 1; done'
```

**Production preview** (use this for anything PWA-related — manifest,
service worker, icons — since those can behave differently in dev):

```bash
npm run build && npm run preview -- --port 4173 > /tmp/vite-preview.log 2>&1 &
disown
timeout 60 bash -c 'until curl -sf http://localhost:4173 >/dev/null; do sleep 1; done'
```

Stop either with `pkill -f "vite (dev|preview)"` when done. Pick a free
port if 5180/4173 are already in use.

## 2. One-time setup

- `npm install` if `node_modules` is missing.
- Playwright's Chromium is already downloaded in this environment
  (`~/Library/Caches/ms-playwright`). If it's ever missing:
  `npx playwright install chromium`.
- `chromium-cli` is **not** available here — drive the browser directly
  with `@playwright/test` (already a devDependency) via the scripts below.

## 3. Drive it

Two small scripts in this skill's directory, run with plain `node`
(they use `@playwright/test`'s `chromium` export):

- **`check.mjs <url> [screenshotPath]`** — generic smoke check. Loads a
  page, waits for the bottom nav, screenshots it, and reports the
  `<link rel="icon">` / `<link rel="manifest">` hrefs plus any console
  errors.

  ```bash
  node .claude/skills/run/check.mjs http://localhost:5180/ /tmp/home.png
  ```

- **`smoke.mjs [baseUrl]`** — representative end-to-end interaction:
  creates a webbing via `/webbing/create`, then confirms it shows up on
  `/webbing`. This proves the Dexie/IndexedDB write path *and*
  `liveQuery()` reactivity both work, not just that the shell renders.

  ```bash
  node .claude/skills/run/smoke.mjs http://localhost:5180
  ```

Always check the script's console-error output / exit code before
declaring success — the shell can render fine while a DB call throws.

## 4. Route map (for ad-hoc checks)

```
/                     — intro + bottom nav
/webbing              — list webbings with accumulated UV days
/webbing/create       — add a webbing (form)
/webbing/[webbingId]  — webbing detail, inline editing
/log                  — hub: active rigs, days up
/log/rigs             — past rigs
/log/rigs/go          — create a new rig
/log/rigs/[rigId]     — rig detail, take-down action
```

## Gotchas

- This shell aliases `cp`/`rm`/etc. to interactive mode — use the
  Write/Edit tools, or `\cp`/`command cp`, for non-interactive file ops.
- IndexedDB requires the `browser` guard from `$app/environment` — only
  a real browser context (Chromium via Playwright) exercises DB-backed
  pages; `curl` only proves static assets/HTML are served.
- `npm run preview` requires a fresh `npm run build` to pick up file
  changes (e.g. new icons, manifest edits) — rebuild before re-checking.
- **Dev-mode hydration race**: in `npm run dev`, the page fires `load`
  well before SvelteKit finishes hydrating. Clicking a submit button
  before hydration attaches its handler lets the `<form>` submit
  natively (full reload to `/path?`, losing any typed values and any
  `status` state). Use `page.goto(url, { waitUntil: 'networkidle' })`
  before interacting with forms.
