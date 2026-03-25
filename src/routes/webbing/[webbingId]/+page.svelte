<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { db, type Webbing } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { webbingDaysById } from '$lib/webbingDays';

	const webbingId = $derived(Number(page.params.webbingId));

	let webbing = $derived(
		browser
			? liveQuery(() => db.webbing.get(webbingId))
			: undefined
	);

	let totalDays = $derived(
		browser ? liveQuery(() => webbingDaysById(webbingId)) : undefined
	);

	let editing = $state(false);
	let form = $state<Partial<Webbing>>({});

	function startEditing(w: Webbing) {
		form = { ...w };
		editing = true;
	}

	async function save() {
		await db.webbing.update(webbingId, {
			name: form.name,
			segmentNumber: form.segmentNumber,
			length: Number(form.length),
			purchaseDate: form.purchaseDate,
			backlogDays: Number(form.backlogDays),
			notes: form.notes ?? ''
		});
		editing = false;
	}

	function cancel() {
		editing = false;
	}
</script>

{#if $webbing}
	{@const w = $webbing}
	<header class="m-8 text-center">
		<h1 class="text-4xl">{w.name}-{w.length}m #{w.segmentNumber}</h1>
		{#if $totalDays !== undefined}
			<p class="text-6xl font-bold mt-2">{$totalDays} <span class="text-2xl font-normal">days</span></p>
		{/if}
	</header>

	{#if !editing}
		<div class="container mx-auto max-w-md px-4">
			<dl class="card preset-filled-surface-100-900 border-surface-200-800 divide-surface-200-800 divide-y border-[1px] overflow-hidden">
				<div class="flex justify-between p-3">
					<dt class="font-semibold">Name</dt>
					<dd>{w.name}</dd>
				</div>
				<div class="flex justify-between p-3">
					<dt class="font-semibold">Segment</dt>
					<dd>#{w.segmentNumber}</dd>
				</div>
				<div class="flex justify-between p-3">
					<dt class="font-semibold">Length</dt>
					<dd>{w.length}m</dd>
				</div>
				<div class="flex justify-between p-3">
					<dt class="font-semibold">Purchase Date</dt>
					<dd>{w.purchaseDate}</dd>
				</div>
				<div class="flex justify-between p-3">
					<dt class="font-semibold">Backlog Days</dt>
					<dd>{w.backlogDays}</dd>
				</div>
				{#if w.notes}
					<div class="flex flex-col gap-1 p-3">
						<dt class="font-semibold">Notes</dt>
						<dd>{w.notes}</dd>
					</div>
				{/if}
			</dl>

			<div class="mt-6 flex justify-center">
				<button class="btn preset-tonal-primary" onclick={() => startEditing(w)}>Edit</button>
			</div>
		</div>
	{:else}
		<form class="container mx-auto max-w-md px-4 flex flex-col gap-4" onsubmit={(e) => { e.preventDefault(); save(); }}>
			<label class="label">
				<span>Name</span>
				<input class="input" type="text" bind:value={form.name} required />
			</label>
			<label class="label">
				<span>Segment #</span>
				<input class="input" type="text" bind:value={form.segmentNumber} required />
			</label>
			<label class="label">
				<span>Length (m)</span>
				<input class="input" type="number" bind:value={form.length} required min="0" />
			</label>
			<label class="label">
				<span>Purchase Date</span>
				<input class="input" type="date" bind:value={form.purchaseDate} required />
			</label>
			<label class="label">
				<span>Backlog Days</span>
				<input class="input" type="number" bind:value={form.backlogDays} required min="0" />
			</label>
			<label class="label">
				<span>Notes</span>
				<textarea class="textarea" bind:value={form.notes} rows="3"></textarea>
			</label>

			<div class="flex gap-4 justify-center mt-2">
				<button type="submit" class="btn preset-filled-primary-500">Save</button>
				<button type="button" class="btn preset-tonal" onclick={cancel}>Cancel</button>
			</div>
		</form>
	{/if}
{:else}
	<p class="m-8 text-center">Loading...</p>
{/if}
