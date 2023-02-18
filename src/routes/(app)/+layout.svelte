<script lang="ts">
	import NotificationsOverlay from '$lib/client/components/NotificationsOverlay.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fetchStatus } from '$lib/client/stores/status';
	import NavBar from '$lib/client/components/layout/NavBar.svelte';
	import Drawer from '$lib/client/components/layout/Drawer.svelte';
	import { theme, animations } from '$lib/client/stores/settings';
	import DropOverlay from '$lib/client/components/layout/DropOverlay.svelte';

	onMount(async () => {
		if (browser) {
			await fetchStatus();
		}
	});

	let drawerOpen = false;

	let dragging = false;
	let dragTimeout;

	const drag = () => {
		dragging = true;
		clearTimeout(dragTimeout);
		dragTimeout = setTimeout(() => {
			dragging = false;
		}, 100);
	};
</script>

<div
	class="flex flex-col w-screen h-screen overflow-hidden"
	data-theme={$theme}
	data-animations={$animations}
	on:dragover={drag}
>
	<NavBar bind:drawerOpen />
	<DropOverlay {dragging} />
	<NotificationsOverlay />
	<div class="drawer drawer-mobile flex-1 h-full">
		<input bind:checked={drawerOpen} class="drawer-toggle" type="checkbox" />
		<div class="drawer-content bg-base-200" style="overflow-y: scroll;">
			<slot />
		</div>
		<Drawer bind:drawerOpen />
	</div>
</div>
