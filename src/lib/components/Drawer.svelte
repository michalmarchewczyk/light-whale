<script lang="ts">
	import DrawerMenu from '$lib/components/DrawerMenu.svelte';

	export let drawerOpen = false;

	const changeDrawerOpen = () => {
		drawerOpen = false;
	};
</script>

<div class="drawer-side lg:shadow-r-lg">
	<div class="drawer-overlay" on:click={changeDrawerOpen}></div>
	<DrawerMenu on:navigate={changeDrawerOpen}/>
</div>


