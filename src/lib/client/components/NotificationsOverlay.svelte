<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fetchEvents } from '$lib/client/stores/events';
	import { events } from '$lib/client/stores/events';
	import { fade } from 'svelte/transition';

	onMount(async () => {
		if (browser) {
			await fetchEvents();
		}
	});
</script>

<div class="toast toast-end">
	{#each $events as event (event.id)}
		<div
			class="alert shadow-lg flex-col items-start gap-0.5 max-w-sm w-sm"
			out:fade
			class:alert-info={event.type === 'docker' || event.type === 'info'}
			class:alert-warning={event.type === 'warning'}
			class:alert-error={event.type === 'error'}
		>
			<span class="font-bold">{event.title}</span>
			<span>{event.message}</span>
		</div>
	{/each}
</div>

<style lang="scss">
</style>
