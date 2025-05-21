<script lang="ts">
	import { db } from '$lib/db';

	let webName = '';
	let webLength = '';
	let webPurchaseDate = '';
	let webNotes = '';
	let webBacklogDays = '';

	async function addWebbing() {
		try {
			const id = await db.webbing.add({
				name: webName,
				length: webLength,
				purchaseDate: webPurchaseDate,
				notes: webNotes
			});
		} catch {}
	}

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		//TODO: write to local storage
		//Question: Why can't I use inspect here?
		console.log(data);
		for (const entry of data.entries()) {
			console.log(entry);
		}
	}
</script>

<header class="m-8 text-center text-5xl">Add webbing</header>

<div class="container flex h-screen flex-col place-content-evenly">
	<form class="text-align: center w-fit" onsubmit={handleSubmit}>
		<label>
			Webbing Name (e.g. y2k#1)
			<input class="text-primary-950" name="name" autocomplete="off" required />
		</label>
	</form>
</div>
