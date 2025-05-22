<script lang="ts">
	import { browser } from '$app/environment';
	import { db, type Webbing } from '$lib/db';
	import { liveQuery } from 'dexie';

	let webbings = liveQuery(() => (browser ? db.webbing.toArray() : []));

	// let webbingDaysAccumulator : Object & {string:number} = {};

	let webbingDays = liveQuery(() => (browser ? db.rig.where({up: 0}).toArray().then(
		(rigs) => {
			return rigs.reduce((
				accumulator, rig
			) => {
				let rigLengthDays = Math.max(
					Math.ceil(
						Math.abs(
							Date.parse(rig.endDate || rig.startDate) - Date.parse(rig.startDate)
						) / (1000 * 60 * 60 * 24)
						), 1);

				rig.webbings.forEach((webbing) => {
					if (webbing in accumulator) {
						accumulator[webbing] += rigLengthDays
					}
					else
					{
						accumulator[webbing] = rigLengthDays
					}
				});
				return accumulator;
			}, {});
		}
	) : []));

	$inspect(webbingDays);
</script>

<header class="m-8 text-center text-5xl">Your Webbing</header>

<div class="container flex flex-row place-content-evenly">
	<a href="/webbing/create" type="button" class="btn preset-tonal-tertiary w-fit self-center"
		>Add Webbing</a
	>
</div>

{#if $webbingDays}
	{#each $webbingDays as day}
		<p>{day.key} : {day.value}</p>
	{/each}
{/if}

{#if $webbings}
	<div class="m-2 flex flex-col items-center justify-center">
		{#each $webbings as webbing: Webbing}
			<a
				href="/webbing/{webbing.id}"
				class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 m-2 block w-full max-w-md divide-y overflow-hidden border-[1px] p-2"
			>
				<header class="flex justify-between">
					<h2 class="h2 w-fit">{webbing.name}-{webbing.length}m #{webbing.segmentNumber}</h2>
					{#if $webbingDays}
						<h3 class="h3 text-right">{webbing.backlogDays + ($webbingDays[`${webbing.name}-${webbing.length}m#${webbing.segmentNumber}`] || 0)} days</h3>
					{/if}
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

