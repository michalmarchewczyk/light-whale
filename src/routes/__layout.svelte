<script context="module" lang="ts">

	import type {Load} from '@sveltejs/kit';

	const load:Load = ({session}) => {
		if (!session.id) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		return {
			props: {}
		};
	};

	export {
		load
	};
</script>

<script lang="ts">
	import NavBar from '$lib/client/components/layout/NavBar.svelte';
	import Drawer from '$lib/client/components/layout/Drawer.svelte';
	import {onMount} from 'svelte';
	import {browser} from '$app/env';
	import SnackbarsOverlay from '$lib/client/components/layout/SnackbarsOverlay.svelte';
	import DropOverlay from '$lib/client/components/layout/DropOverlay.svelte';

	let drawerOpen = false;

	let currentTheme:'default-light' | 'default-dark' = 'default-light';

	let loaded = false;
	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'default-light' || savedTheme === 'default-dark') {
			currentTheme = savedTheme;
		}
		loaded = true;
	});

	$: {
		if (browser && loaded) {
			localStorage.setItem('theme', currentTheme);
		}
	}

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


<div class="flex flex-col w-screen h-screen overflow-hidden" data-theme={currentTheme} on:dragover={drag}>
	<NavBar bind:drawerOpen={drawerOpen}/>
	<SnackbarsOverlay/>
	<DropOverlay {dragging}/>
	<div class="drawer drawer-mobile flex-1">
		<input bind:checked={drawerOpen} class="drawer-toggle" type="checkbox">
		<div class="drawer-content bg-base-200" style="overflow-y: scroll;">
			<slot></slot>
		</div>
		<Drawer bind:currentTheme={currentTheme} bind:drawerOpen={drawerOpen}/>
	</div>
</div>

<style global lang="scss">
  @use 'src/lib/client/styles/main';
</style>
