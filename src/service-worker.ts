/// <reference lib="webworker" />
import { build, files, prerendered, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files, ...prerendered];

sw.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		if (ASSETS.includes(url.pathname)) {
			const cached = await cache.match(url.pathname);
			if (cached) return cached;
		}

		try {
			const response = await fetch(event.request);
			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}
			return response;
		} catch (err) {
			const cached = await cache.match(event.request);
			if (cached) return cached;

			// Offline navigation to a route we haven't cached yet - fall
			// back to the cached app shell so the SPA can boot and route.
			if (event.request.mode === 'navigate') {
				const shell = await cache.match('/');
				if (shell) return shell;
			}

			throw err;
		}
	}

	event.respondWith(respond());
});
