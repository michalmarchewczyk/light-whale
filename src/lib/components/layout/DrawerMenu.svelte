<script lang="ts">
	import {createEventDispatcher} from 'svelte';
	import {dockerAvailable} from '$lib/stores/docker';
	import HomeIcon from '$icons/home.svg';
	import ChartSquareBarIcon from '$icons/chart-square-bar.svg';
	import CubeIcon from '$icons/cube.svg';
	import DiscIcon from '$lib/assets/icons/disc.svg';
	import DatabaseIcon from '$icons/database.svg';
	import GlobeAltIcon from '$icons/globe-alt.svg';
	import CogIcon from '$icons/cog.svg';
	import {networkAvailable} from '$lib/stores/network';
	import DrawerMenuItem from '$lib/components/layout/DrawerMenuItem.svelte';
	import {nginxAvailable} from '$lib/stores/network';

	const dispatch = createEventDispatcher();

	export let currentTheme;
</script>

<ul class="menu p-4 px-4 overflow-y-auto bg-base-100 w-60 shadow-r-lg lg:shadow-none lg:border-r-2 lg:border-base-300 pb-2">
	<DrawerMenuItem icon={HomeIcon} path="/" on:click={() => dispatch('navigate')}>
		Home
	</DrawerMenuItem>
	<DrawerMenuItem icon={ChartSquareBarIcon} path="/stats" on:click={() => dispatch('navigate')}>
		Statistics
	</DrawerMenuItem>

	<li class="menu-title mt-4 mb-2 flex-row">
		<span>Docker</span>
		<div class="badge mt-0.5 {$dockerAvailable ? 'badge-success' : 'badge-error'}">
			{$dockerAvailable ? 'Connected' : 'Disconnected'}
		</div>
	</li>

	<DrawerMenuItem icon={CubeIcon} path="/containers" on:click={() => dispatch('navigate')}>
		Containers
	</DrawerMenuItem>
	<DrawerMenuItem icon={DiscIcon} path="/images" on:click={() => dispatch('navigate')}>
		Images
	</DrawerMenuItem>
	<DrawerMenuItem icon={DatabaseIcon} path="/volumes" on:click={() => dispatch('navigate')}>
		Volumes
	</DrawerMenuItem>

	<li class="menu-title mt-4 mb-2 flex-row">
		<span>Network</span>
		<div class="badge mt-0.5 {$networkAvailable && $nginxAvailable ? 'badge-success' : 'badge-error'}">
			{$networkAvailable && $nginxAvailable ? 'Working' : 'Not working'}
		</div>
	</li>

	<DrawerMenuItem icon={GlobeAltIcon} path="/sites" on:click={() => dispatch('navigate')}>
		Sites
	</DrawerMenuItem>
	<DrawerMenuItem icon={CogIcon} path="/settings" on:click={() => dispatch('navigate')}>
		Settings
	</DrawerMenuItem>

	<li class="mt-auto">
		<button class="btn btn-sm mt-4 text-xs btn-ghost font-semibold" on:click={() => {
			const newTheme = currentTheme === 'default-light' ? 'default-dark' : 'default-light';
			dispatch('changeTheme', newTheme);
		}}>
			Switch to {currentTheme === 'default-light' ? 'dark' : 'light'} theme
		</button>
	</li>
</ul>


<style lang="scss">
  .menu li {
	@apply mb-2 text-base-content font-semibold;
  }
</style>
