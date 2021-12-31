<script lang="ts">
	import {page} from '$app/stores';
	import {createEventDispatcher} from 'svelte';
	import {dockerAvailable} from '$lib/stores/docker';
	import HomeIcon from '$icons/home.svg';
	import ChartSquareBarIcon from '$icons/chart-square-bar.svg';
	import CubeIcon from '$icons/cube.svg';
	import DiscIcon from '$lib/assets/icons/disc.svg';
	import DatabaseIcon from '$icons/database.svg';
	import GlobeAltIcon from '$icons/globe-alt.svg';
	import CogIcon from '$icons/cog.svg';

	const dispatch = createEventDispatcher();

	export let currentTheme;
</script>

<ul class="menu p-4 px-4 overflow-y-auto bg-base-100 w-60 shadow-r-lg lg:shadow-none lg:border-r-2 lg:border-base-300 pb-2">
	<li>
		<a href="/" class:bg-base-300="{$page.path === '/'}" on:click={() => dispatch('navigate')}>
			<HomeIcon class="h-6 w-6 stroke-2"/>
			<span class="mx-3">Home</span>
		</a>
	</li>
	<li>
		<a href="/stats" class:bg-base-300="{$page.path.startsWith('/stats')}" on:click={() => dispatch('navigate')}>
			<ChartSquareBarIcon class="h-6 w-6 stroke-2"/>
			<span class="mx-3">Statistics</span>
		</a>
	</li>
	<li class="menu-title mt-4 mb-2 flex-row">
		<span>Docker</span>
		<div class="badge mt-0.5 {$dockerAvailable ? 'badge-success' : 'badge-error'}">
			{$dockerAvailable ? 'Connected' : 'Disconnected'}
		</div>
	</li>
	<li>
		<a href="/containers" class:bg-base-300="{$page.path.startsWith('/containers')}"
		   on:click={() => dispatch('navigate')}>
			<CubeIcon class="h-6 w-6 stroke-2"/>
			<span class="mx-3">Containers</span>
		</a>
	</li>
	<li>
		<a href="/images" class:bg-base-300="{$page.path.startsWith('/images')}" on:click={() => dispatch('navigate')}>
			<DiscIcon class="h-6 w-6 stroke-2"/>
			<span class="mx-3">Images</span>
		</a>
	</li>
	<li>
		<a href="/volumes" class:bg-base-300="{$page.path.startsWith('/volumes')}"
		   on:click={() => dispatch('navigate')}>
			<DatabaseIcon class="h-6 w-6 stroke-2"/>
			<span class="mx-3">Volumes</span>
		</a>
	</li>
	<li class="menu-title mt-4 mb-2">
	  <span>Networking</span>
	</li>
	<li>
		<a href="/sites" class:bg-base-300="{$page.path.startsWith('/sites')}" on:click={() => dispatch('navigate')}>
			<GlobeAltIcon class="h-6 w-6 stroke-2"/>
			<span class="mx-3">Sites</span>
		</a>
	</li>
	<li>
		<a href="/settings" class:bg-base-300="{$page.path.startsWith('/settings')}"
		   on:click={() => dispatch('navigate')}>
			<CogIcon class="h-6 w-6 stroke-2"/>
			<span class="mx-3">Settings</span>
		</a>
	</li>
	<li class="mt-auto">
		<button class="btn btn-sm mt-4 text-xs btn-ghost" on:click={() => {
			const newTheme = currentTheme === 'default-light' ? 'default-dark' : 'default-light';
			dispatch('changeTheme', newTheme);
		}}>
			Change to {currentTheme === 'default-light' ? 'dark' : 'light'} theme
		</button>
	</li>
</ul>


<style lang="scss">
  .menu li {
	@apply mb-2 text-base-content;
  }
</style>
