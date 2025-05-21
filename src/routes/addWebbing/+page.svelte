<script lang="ts">
	import { db } from '$lib/db';
	import { text } from '@sveltejs/kit';

	let status = '';

	let webName = '';
	let webNumber = '';
	let webBacklogDays = 0;
	let webLength = 0;
	let webPurchaseDate = '';
	let webNotes = '';

	async function addWebbing() {
		try {
			const id = await db.webbing.add({
				name: webName,
				segmentNumber: webNumber,
				length: webLength,
				backlogDays: webBacklogDays,
				purchaseDate: webPurchaseDate,
				notes: webNotes
			});

			status = 'webbing added successfully';

			webName = '';
			webNumber = '';
			webBacklogDays = 0;
			webLength = 0;
			webPurchaseDate = '';
			webNotes = '';
		} catch (error) {
			status = `failed to add webbing, Error:${error}`;
		}
	}

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		addWebbing();
	}
</script>

<header class="m-8 text-center text-5xl">Add Webbing</header>

<p class="p">{status}</p>

<div class="col container flex flex-col place-content-evenly p-2">
	<form class="text-align: center w-fit" onsubmit={handleSubmit}>
		<!--
		<label class="label">
			<span class="label-text"></span>
			<input class="input" type="" bind:value={} autocomplete="off" required />
		</label>
		-->
		<label class="label">
			<span class="label-text">Webbing Name (e.g. y2k)</span>
			<input class="input" type="text" bind:value={webName} autocomplete="off" required />
		</label>

		<label class="label">
			<span class="label-text">Segment Number (e.g. 1 if you own one piece)</span>
			<input class="input" type="text" bind:value={webNumber} autocomplete="off" />
		</label>

		<label class="label">
			<span class="label-text">Length (meters)</span>
			<input class="input" type="number" bind:value={webLength} autocomplete="off" required />
		</label>

		<label class="label">
			<span class="label-text">Backlog Days (how many days has your segment been rigged?)</span>
			<input class="input" type="number" bind:value={webBacklogDays} autocomplete="off" required />
		</label>

		<label class="label">
			<span class="label-text"> Notes </span>
			<textarea class="textarea" rows="4" bind:value={webNotes}></textarea>
		</label>

		<button class="btn preset-outlined-surface-300-700 mt-2" type="submit">Save</button>
	</form>
</div>
