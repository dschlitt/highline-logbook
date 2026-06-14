#!/usr/bin/env node
// Generic smoke check: load a page, wait for the app shell, screenshot it,
// and report favicon/manifest hrefs plus any console errors.
//
// Usage: node check.mjs [url] [screenshotPath]
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:5180/';
const screenshotPath = process.argv[3] ?? '/tmp/highline-check.png';

const browser = await chromium.launch();
const page = await browser.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
	if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(String(err)));

await page.goto(url, { waitUntil: 'load' });
await page.waitForSelector('[data-testid="nav-bar"]');
await page.screenshot({ path: screenshotPath, fullPage: true });

const iconHref = await page.locator('link[rel="icon"]').getAttribute('href');
const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');

console.log('URL:', url);
console.log('Screenshot:', screenshotPath);
console.log('Favicon href:', iconHref);
console.log('Manifest href:', manifestHref);
console.log('Console errors:', consoleErrors.length ? consoleErrors : 'none');

await browser.close();
process.exit(consoleErrors.length ? 1 : 0);
