<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { db, type Rig, type Webbing } from '$lib/db';
	import { liveQuery } from 'dexie';
	import { MultiSelect } from 'svelte-multiselect';

	const rigId = $derived(parseInt(page.params.rigId));

	let rig = $derived(browser ? liveQuery(() => db.rig.get({ id: rigId })) : undefined);
	let allWebbings = $derived(browser ? liveQuery(() => db.webbing.toArray()) : undefined);

	let editing = $state(false);
	let form = $state<Partial<Rig>>({});
	let formSelected = $state<string[]>([]);

	function daysUp(startDate: string, endDate?: string): number {
		const end = endDate ? Date.parse(endDate) : Date.now();
		return Math.max(Math.ceil(Math.abs(end - Date.parse(startDate)) / (1000 * 60 * 60 * 24)), 1);
	}

	function startEditing(r: Rig) {
		form = { ...r };
		formSelected = [...r.webbings];
		editing = true;
	}

	async function save() {
		await db.rig.update(rigId, {
			name: form.name,
			startDate: form.startDate,
			endDate: form.endDate || undefined,
			up: form.endDate ? 0 : 1,
			webbings: formSelected
		});
		editing = false;
	}

	async function takeDown() {
		const today = new Date().toISOString().split('T')[0];
		await db.rig.update(rigId, { endDate: today, up: 0 });
	}

	function cancel() {
		editing = false;
	}
</script>

{#if $rig}
	{@const r = $rig}
	<header class="m-8 text-center text-4xl">{r.name}</header>

	{#if !editing}
		<div class="container mx-auto max-w-md px-4">
			<dl class="card preset-filled-surface-100-900 border-surface-200-800 divide-surface-200-800 divide-y border-[1px] overflow-hidden">
				<div class="flex justify-between p-3">
					<dt class="font-semibold">Status</dt>
					<dd>{r.up ? '🟢 Active' : '⚫ Past'}</dd>
				</div>
				<div class="flex justify-between p-3">
					<dt class="font-semibold">Start Date</dt>
					<dd>{r.startDate}</dd>
				</div>
				<div class="flex justify-between p-3">
					<dt class="font-semibold">End Date</dt>
					<dd>{r.endDate ?? '—'}</dd>
				</div>
				<div class="flex justify-between p-3">
					<dt class="font-semibold">Days Up</dt>
					<dd>{daysUp(r.startDate, r.endDate)}{r.up ? ' (and counting)' : ''}</dd>
				</div>
				<div class="flex flex-col gap-1 p-3">
					<dt class="font-semibold">Webbings</dt>
					<dd class="flex flex-col gap-1 mt-1">
						{#each r.webbings as w}
							<span class="badge preset-tonal-secondary w-fit">{w}</span>
						{/each}
					</dd>
				</div>
			</dl>

			<div class="mt-6 flex justify-center gap-4">
				<button class="btn preset-tonal-primary" onclick={() => startEditing(r)}>Edit</button>
				{#if r.up}
					<button class="btn preset-tonal-warning" onclick={takeDown}>Take Down</button>
				{/if}
			</div>
		</div>
	{:else}
		<form class="container mx-auto max-w-md px-4 flex flex-col gap-4" onsubmit={(e) => { e.preventDefault(); save(); }}>
			<label class="label">
				<span>Rig Name</span>
				<input class="input" type="text" bind:value={form.name} required />
			</label>
			<label class="label">
				<span>Start Date</span>
				<input class="input" type="date" bind:value={form.startDate} required />
			</label>
			<label class="label">
				<span>End Date</span>
				<input class="input" type="date" bind:value={form.endDate} />
			</label>
			<label class="label">
				<span>Webbings</span>
				<MultiSelect
					bind:selected={formSelected}
					options={$allWebbings?.map((w: Webbing) => `${w.name}-${w.length}m#${w.segmentNumber}`) ?? []}
				/>
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
