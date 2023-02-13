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

<div class="toast toast-end z-50 pr-6">
	{#each $events as event (event.id)}
		<div
			class="alert shadow-lg flex-col items-start gap-0 max-w-xs w-80 p-3.5"
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
