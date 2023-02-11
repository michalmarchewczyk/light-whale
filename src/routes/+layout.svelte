<script lang="ts">
	import '$lib/client/styles/main.scss';
	import NotificationsOverlay from '$lib/client/components/NotificationsOverlay.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fetchStatus } from '$lib/client/stores/status';

	onMount(async () => {
		if (browser) {
			await fetchStatus();
		}
	});
</script>

<NotificationsOverlay />

<slot />

<style global lang="scss">
</style>
