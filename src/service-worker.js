import { build } from '$service-worker';

self.addEventListener('fetch', (event) => {
	console.log('an event happened and I caught it in the service worker');
	console.log('what what');
	console.log(event.request.url);

	// I caught the event, therefore store the stuff locallly.
	// also cache everything starting on first load.jk
})
