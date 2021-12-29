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
	import NavBar from '$lib/components/NavBar.svelte';
	import Drawer from '$lib/components/Drawer.svelte';

	let drawerOpen = false;

	let currentTheme:'default-light'|'default-dark' = 'default-light';

</script>

<svelte:head>
	<title>Docker Control Panel</title>
</svelte:head>

<div class="flex flex-col w-screen h-screen overflow-hidden" data-theme={currentTheme}>
	<NavBar bind:drawerOpen={drawerOpen}/>
	<div class="drawer drawer-mobile flex-1">
		<input type="checkbox" class="drawer-toggle" bind:checked={drawerOpen}>
		<div class="drawer-content bg-base-200">
			<slot></slot>
		</div>
		<Drawer bind:drawerOpen={drawerOpen} bind:currentTheme={currentTheme}/>
	</div>
</div>

<style lang="scss" global>
  @use '../lib/styles/main';
</style>
