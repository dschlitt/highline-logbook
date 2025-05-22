<script lang="ts">
	import { MultiSelect } from 'svelte-multiselect';
	import { liveQuery } from 'dexie';
	import { db, type Webbing, type Rig } from '$lib/db';

	let rigName = $state('');
	let status = $state('');

	let rigStartDate = $state(new Date().toISOString().split('T')[0]);

	let webbings = liveQuery(() => db.table('webbing').toArray());
	$inspect(webbings);

	let selected: string[] = $state([]);

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		try {
			const id = await db.table('rig').add({
				name: rigName,
				webbings: selected,
				startDate: rigStartDate
			});
			status = 'rig added successfully';
			// TODO: navigate somewhere..
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

			<!--TODO: can I mark this required -->
			<!-- TODO disable if webbings haven't loaded, would be cool if empty array was disabled. -->
			<MultiSelect
				bind:selected
				options={$webbings?.map((w: Webbing) => w.name + '-' + w.length + 'm#' + w.segmentNumber) ||
					[]}
			/>
		</label>

		<button class="btn preset-outlined-surface-300-700 mt-2" type="submit">Rig It!</button>
	</form>
</div>
