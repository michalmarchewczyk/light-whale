<script lang="ts">
	import DrawerMenu from '$lib/client/components/layout/DrawerMenu.svelte';
	export let drawerOpen = false;
	const changeDrawerOpen = () => {
		drawerOpen = false;
	};
</script>

<div class="drawer-side lg:shadow-r-lg">
	<div class="drawer-overlay" on:click={changeDrawerOpen} />
	<DrawerMenu on:navigate={changeDrawerOpen} />
</div>
