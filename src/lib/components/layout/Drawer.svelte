<script lang="ts">
	import DrawerMenu from '$lib/components/layout/DrawerMenu.svelte';

	export let drawerOpen = false;
	export let currentTheme;

	const changeDrawerOpen = () => {
		drawerOpen = false;
	};

	const changeCurrentTheme = (e) => {
		currentTheme = e.detail;
	};
</script>

<div class="drawer-side lg:shadow-r-lg">
	<div class="drawer-overlay" on:click={changeDrawerOpen}></div>
	<DrawerMenu currentTheme={currentTheme} on:changeTheme={changeCurrentTheme} on:navigate={changeDrawerOpen}/>
</div>


