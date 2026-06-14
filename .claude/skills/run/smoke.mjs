#!/usr/bin/env node
// Representative interaction: create a webbing via /webbing/create and
// confirm it appears on /webbing. Proves the Dexie/IndexedDB write path
// and liveQuery() reactivity both work, not just that the shell renders.
//
// Usage: node smoke.mjs [baseUrl]
import { chromium } from '@playwright/test';

const baseUrl = (process.argv[2] ?? 'http://localhost:5180').replace(/\/$/, '');
const name = `smoke-test-${Date.now()}`;

const browser = await chromium.launch();
const page = await browser.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
	if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(String(err)));

// 'networkidle' matters here: in dev mode SvelteKit hydration finishes well
// after 'load', and clicking Save before hydration attaches its handler lets
// the <form> submit natively (full page reload, losing the typed values).
await page.goto(`${baseUrl}/webbing/create`, { waitUntil: 'networkidle' });
await page.getByLabel('Webbing Name (e.g. y2k)').fill(name);
await page.getByLabel('Length (meters)').fill('60');
await page.getByLabel('Backlog Days (how many days has your segment been rigged?)').fill('0');
await page.getByRole('button', { name: 'Save' }).click();
await page.getByText('webbing added successfully').waitFor();

await page.goto(`${baseUrl}/webbing`, { waitUntil: 'load' });
await page.getByText(name).waitFor({ timeout: 5000 });
await page.screenshot({ path: '/tmp/highline-smoke.png', fullPage: true });

console.log(`Created "${name}" and confirmed it appears on /webbing`);
console.log('Screenshot: /tmp/highline-smoke.png');
console.log('Console errors:', consoleErrors.length ? consoleErrors : 'none');

await browser.close();
process.exit(consoleErrors.length ? 1 : 0);
