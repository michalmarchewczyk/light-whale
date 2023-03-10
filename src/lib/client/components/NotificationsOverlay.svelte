<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fetchEvents } from '$lib/client/stores/events';
	import { events } from '$lib/client/stores/events';
	import { fade } from 'svelte/transition';
	import { clearEvents, removeEvent } from '$lib/client/stores/events.js';
	import XMarkIcon from '$icons/x-mark.svg';

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
			class:alert-success={event.type === 'success'}
			class:alert-warning={event.type === 'warning'}
			class:alert-error={event.type === 'error'}
			on:click={() => {
				removeEvent(event);
			}}
		>
			<span class="font-bold">{event.title}</span>
			<span>{event.message}</span>
		</div>
	{/each}
	{#if $events.length > 5}
		<div
			class="btn btn-square btn-sm bg-neutral/60 border-none absolute right-4 bottom-4"
			on:click={clearEvents}
		>
			<XMarkIcon class="w-6 h-6 stroke-2" />
		</div>
	{/if}
</div>

<style lang="scss">
</style>
