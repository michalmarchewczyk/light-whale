<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import Drawer from '$lib/components/Drawer.svelte';

	let drawerOpen = false;

</script>

<svelte:head>
  <title>Docker Control Panel</title>
</svelte:head>

<div class="flex flex-col w-screen h-screen overflow-hidden">
	<NavBar bind:drawerOpen={drawerOpen}/>
	<div class="drawer drawer-mobile flex-1">
		<input type="checkbox" class="drawer-toggle" bind:checked={drawerOpen}>
		<div class="drawer-content">
			<slot></slot>
		</div>
		<Drawer bind:drawerOpen={drawerOpen}/>
	</div>
</div>

<style lang="scss" global>
	@use '../lib/styles/main';
</style>
