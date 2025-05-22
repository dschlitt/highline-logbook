<script lang="ts">
	import { db, type Rig } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { browser } from '$app/environment';

	let currentRigs = liveQuery(() => (browser ? db.rig.where({ up: 1 }).toArray() : []));

	$inspect(currentRigs);
</script>

<header class="m-8 text-center text-5xl">Log a Rig</header>

<div class="flex flex-row place-content-evenly">
	<a href="/log/rigs/go" type="button" class="btn preset-tonal-tertiary m-4 w-fit self-center">
		New Rig</a
	>

	<a href="/log/past-rigs" type="button" class="btn preset-tonal-tertiary m-4 w-fit self-center">
		Past Rigs</a
	>
</div>

{#if $currentRigs}
	<div class="m-2 flex flex-col items-center justify-center">
		<header class="text-center text-xl">Current Rigs</header>
		{#each $currentRigs as rig: Rig}
			<a
				href="/rig/{rig.id}"
				class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 m-2 block w-full max-w-md divide-y overflow-hidden border-[1px] p-2"
			>
				<header class="flex justify-between">
					<p class="text-l w-fit">{rig.name}</p>
					<p class="text-m text-right">? days rigged</p>
				</header></a
			>
		{/each}
	</div>
{:else}
	<!-- TODO: LOL find a way to tell these situations apart -->
	<p>loading or no rigs</p>
{/if}
