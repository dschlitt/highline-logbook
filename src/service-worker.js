import { build } from '$service-worker';

self.addEventListener('fetch', (event) => {
	console.log('an event happened and I caught it in the service worker');
	console.log(event.request.url);
})
