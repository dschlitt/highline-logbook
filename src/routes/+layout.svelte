<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	// Icons
	import { SquarePen } from '@lucide/svelte';
	import { Sheet } from '@lucide/svelte';
	import { Calendar } from '@lucide/svelte';

	let value = $state('webbing');
	let { children } = $props();

	$inspect(page.route.id);
</script>

{@render children()}

<!-- Component -->
<div class="fixed bottom-0 w-full">
	<Navigation.Bar>
		<Navigation.Tile href="/addWebbing" label="Add" selected={page.route.id == '/addWebbing'}
			><SquarePen /></Navigation.Tile
		>
		<Navigation.Tile href="/webbing" label="Webbing" selected={page.route.id.startsWith('/webbing')}
			><Sheet /></Navigation.Tile
		>
		<Navigation.Tile href="/log" label="Log" selected={page.route.id === '/log'}
			><Calendar /></Navigation.Tile
		>
	</Navigation.Bar>
</div>
