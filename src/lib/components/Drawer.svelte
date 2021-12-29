<script lang="ts">
	import DrawerMenu from '$lib/components/DrawerMenu.svelte';

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
	<DrawerMenu on:navigate={changeDrawerOpen} on:changeTheme={changeCurrentTheme} currentTheme={currentTheme}/>
</div>


