<script lang="ts">
	import { MultiSelect } from 'svelte-multiselect';
	import { liveQuery } from 'dexie';
	import { goto } from '$app/navigation';
	import { db, type Webbing } from '$lib/db';

	let rigName = $state('');
	let status = $state('');

	let rigStartDate = $state(new Date().toISOString().split('T')[0]);

	let webbings = liveQuery(() => db.table('webbing').toArray());

	let selected: string[] = $state([]);

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		try {
			await db.table('rig').add({
				name: rigName,
				webbings: selected,
				startDate: rigStartDate,
				up: 1
			});
			goto('/log');
		} catch (error) {
			status = `failed to add rig, Error:${error}`;
		}
	}
</script>

<header class="m-8 text-center text-5xl">Log a Rig</header>

<div class="col container flex flex-col place-content-evenly p-2">
	<form class="text-align: center w-fit" onsubmit={handleSubmit}>
		<label class="label mb-1">
			<span class="label-text">Rig Name (e.g. The Gulch 70m)</span>
			<input class="input" type="text" bind:value={rigName} autocomplete="off" required />
		</label>

		<label class="label mb-1">
			<span class="label-text">Start Date (defaults to today)</span>
			<input class="input" type="date" bind:value={rigStartDate} autocomplete="off" required />
		</label>

		<label class="label mb-1">
			<span class="label-text">Webbing</span>
			<MultiSelect
				bind:selected
				options={$webbings?.map((w: Webbing) => w.name + '-' + w.length + 'm#' + w.segmentNumber) ||
					[]}
			/>
		</label>

		{#if status}
			<p class="text-error-500 mt-2">{status}</p>
		{/if}

		<button class="btn preset-outlined-surface-300-700 mt-2" type="submit">Rig It!</button>
	</form>
</div>
