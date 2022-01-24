<script context="module" lang="ts">
	import type {LoadInput, LoadOutput} from '@sveltejs/kit';

	export async function load({session}:LoadInput):Promise<LoadOutput> {
		if (!session.id) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		return {
			props: {}
		};
	}
</script>

<script lang="ts">
	import NavBar from '$lib/components/layout/NavBar.svelte';
	import Drawer from '$lib/components/layout/Drawer.svelte';
	import {onMount} from 'svelte';
	import {browser} from '$app/env';
	import SnackbarsOverlay from '$lib/components/layout/SnackbarsOverlay.svelte';

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

</script>


<div class="flex flex-col w-screen h-screen overflow-hidden" data-theme={currentTheme}>
	<NavBar bind:drawerOpen={drawerOpen}/>
	<SnackbarsOverlay/>
	<div class="drawer drawer-mobile flex-1">
		<input bind:checked={drawerOpen} class="drawer-toggle" type="checkbox">
		<div class="drawer-content bg-base-200" style="overflow-y: scroll;">
			<slot></slot>
		</div>
		<Drawer bind:currentTheme={currentTheme} bind:drawerOpen={drawerOpen}/>
	</div>
</div>

<style global lang="scss">
  @use '../lib/styles/main';
</style>
