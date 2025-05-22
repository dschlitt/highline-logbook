<script lang="ts">
	import { db } from '$lib/db';
	import { text } from '@sveltejs/kit';

	let status = $state('');

	let webName = $state('');
	let webNumber = $state('');
	let webBacklogDays: Number | undefined = $state();
	let webLength: Number | undefined = $state();
	let webPurchaseDate = $state('');
	let webNotes = $state('');

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
			<input
				class="input"
				type="text"
				bind:value={webName}
				autocomplete="off"
				required
				placeholder="Kill Bill"
			/>
		</label>

		<label class="label">
			<span class="label-text">Length (meters)</span>
			<input
				class="input"
				type="number"
				bind:value={webLength}
				autocomplete="off"
				required
				placeholder="80"
			/>
		</label>

		<!-- TODO: enforce uniqueness, suggest auto incrementing number for this name -->
		<!-- Could I support bulk add here and create new sub ids as necessary? -->
		<label class="label">
			<span class="label-text"
				>Segment Number (1 if you have 1 piece, 2 if you have 2 of the same, etc...)</span
			>
			<input class="input" type="text" bind:value={webNumber} autocomplete="off" placeholder="1" />
		</label>

		<label class="label">
			<span class="label-text">Backlog Days (how many days has your segment been rigged?)</span>
			<input
				class="input"
				type="number"
				bind:value={webBacklogDays}
				autocomplete="off"
				required
				placeholder="69"
			/>
		</label>

		<label class="label">
			<span class="label-text"> Notes </span>
			<textarea class="textarea" rows="2" bind:value={webNotes} placeholder='Good weight training. Me likey'></textarea>
		</label>

		<button class="btn preset-outlined-surface-300-700 mt-2" type="submit">Save</button>
	</form>
</div>
