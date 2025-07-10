<script lang="ts">
import { page } from '$app/state';
import { db, type Rig } from '$lib/db';
import { liveQuery } from 'dexie';
const rigId = $derived(parseInt(page.params.rigId));

let rig = liveQuery(() => db.rig.get({ id: rigId }));
</script>

{#if $rig}
	<p>{$rig?.name}</p>
	<p>{$rig?.startDate}</p>
	<p>{$rig?.endDate}</p>
{:else}
	<p>loading rig {rigId} ...</p>
{/if}
