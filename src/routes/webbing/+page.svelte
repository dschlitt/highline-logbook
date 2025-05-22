<script lang="ts">
	import { browser } from '$app/environment';
	import { db, type Webbing } from '$lib/db';
	import { liveQuery } from 'dexie';

	let webbings = liveQuery(() => (browser ? db.webbing.toArray() : []));
</script>

<header class="m-8 text-center text-5xl">Your Webbing</header>

<div class="container flex flex-row place-content-evenly">
	<a href="/webbing/create" type="button" class="btn preset-tonal-tertiary w-fit self-center"
		>Add Webbing</a
	>
</div>

{#if $webbings}
	<div class="m-2 flex flex-col items-center justify-center">
		{#each $webbings as webbing: Webbing}
			<a
				href="/webbing/{webbing.id}"
				class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 m-2 block w-full max-w-md divide-y overflow-hidden border-[1px] p-2"
			>
				<header class="flex justify-between">
					<h2 class="h2 w-fit">{webbing.name}-{webbing.length}m #{webbing.segmentNumber}</h2>
					<h3 class="h3 text-right">{webbing.backlogDays} days</h3>
				</header>
				{#if webbing.notes}
					<article class="">
						<p>{webbing.notes}</p>
					</article>
				{/if}
			</a>
		{/each}
	</div>
{:else}
	<p>webbing loading ...</p>
{/if}
