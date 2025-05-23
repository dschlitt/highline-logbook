<script lang="ts">
    import { db, type Rig } from '$lib/db';
    import { liveQuery } from 'dexie';

    let rigs = liveQuery(() => db.rig.where({up: 0}).toArray());
</script>

<header class="m-8 text-center text-5xl">Past Rigs</header>

{#if $rigs}
	<div class="m-2 flex flex-col items-center justify-center">
        {#each $rigs as rig: Rig}
            <a
				href="/log/rigs/{rig.id}"
				class="card preset-filled-surface-100-900 border-surface-200-800 card-hover divide-surface-200-800 m-2 block w-full max-w-md divide-y overflow-hidden border-[1px] p-2"
			>
            <!-- TODO add click to expand -->
				<header class="flex justify-between">
					<h2 class="h2 w-fit">{rig.name}</h2>
                    <!-- TODO: Add days rigged -->
				</header>
                <article class="">
                    <p>{rig.webbings}</p>
                </article>
			</a>
        {/each}
    </div>
{:else}
<p>rigs loading ...</p>
{/if}