<script lang="ts">
    import { page } from '$app/state';
    import { db } from '$lib/db';
    import { liveQuery } from 'dexie';

    const rigId = $derived(page.params.rigId);

    let rig = liveQuery(() => db.rig.where({id: rigId}).first())
</script>

{#if $rig}
<p>{ $rig?.name }</p>
<p>{ $rig?.startDate }</p>
<p>{ $rig?.endDate }</p>
{:else}
<p>loading rig...</p>
{/if}