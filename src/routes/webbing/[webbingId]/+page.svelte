<script lang="ts">
	import { page } from '$app/state';

	const webbingId = $derived(page.params.webbingId);
</script>

<p>{webbingId}</p>
