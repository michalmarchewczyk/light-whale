<script lang="ts">
	import {createEventDispatcher} from 'svelte';
	import HomeIcon from '$icons/home.svg';
	// import ChartSquareBarIcon from '$icons/chart-square-bar.svg';
	import CubeIcon from '$icons/cube.svg';
	import DiscIcon from '$lib/client/assets/icons/disc.svg';
	// import DatabaseIcon from '$icons/database.svg';
	import GlobeAltIcon from '$icons/globe-alt.svg';
	import GlobeIcon from '$icons/globe.svg';
	import CogIcon from '$icons/cog.svg';
	import FolderOpenIcon from '$icons/folder-open.svg';
	import GitIcon from '$lib/client/assets/icons/git.svg';
	import DockerIcon from '$lib/client/assets/icons/docker.svg';
	import CheckCircleIcon from '$icons/check-circle.svg';
	import ViewListIcon from '$icons/view-list.svg';
	import QuestionMarkCircleIcon from '$icons/question-mark-circle.svg';
	import {status} from '$lib/client/stores/status';

	import DrawerMenuItem from '$lib/client/components/layout/DrawerMenuItem.svelte';

	const dispatch = createEventDispatcher();

	let online:boolean;

	$: online = $status.network && $status.running && $status.connected;
</script>

<ul class="menu menu-compact p-4 px-4 overflow-y-auto bg-base-100 w-60 shadow-r-lg lg:shadow-none lg:border-r-2 lg:border-base-300 pb-2 max-h-[calc(100%-4rem)] lg:max-h-full">
	<DrawerMenuItem icon={HomeIcon} path="/" on:click={() => dispatch('navigate')}>
		Home
	</DrawerMenuItem>
<!--	<DrawerMenuItem icon={ChartSquareBarIcon} path="/stats" on:click={() => dispatch('navigate')}>-->
<!--		Statistics-->
<!--	</DrawerMenuItem>-->

	<li class="menu-title">
		<span>Docker</span>
		<div class="badge mt-0.5 {$status.dockerPinging ? 'badge-success' : 'badge-error'}">
			{$status.dockerPinging ? 'Connected' : 'Disconnected'}
		</div>
	</li>

	<DrawerMenuItem icon={CubeIcon} path="/containers" on:click={() => dispatch('navigate')}>
		Containers
	</DrawerMenuItem>
	<DrawerMenuItem icon={DiscIcon} path="/images" on:click={() => dispatch('navigate')}>
		Images
	</DrawerMenuItem>
<!--	<DrawerMenuItem icon={DatabaseIcon} path="/volumes" on:click={() => dispatch('navigate')}>-->
<!--		Volumes-->
<!--	</DrawerMenuItem>-->

	<li class="menu-title">
		<span>Network</span>
		<div class="badge mt-0.5 {online ? 'badge-success' : 'badge-error'}">
			{online ? 'Working' : 'Not working'}
		</div>
	</li>

	<DrawerMenuItem icon={GlobeAltIcon} path="/sites" on:click={() => dispatch('navigate')}>
		Sites
	</DrawerMenuItem>
	<DrawerMenuItem icon={GlobeIcon} path="/dns" on:click={() => dispatch('navigate')}>
		DNS
	</DrawerMenuItem>


	<li class="menu-title">
		<span>Sources</span>
	</li>

	<DrawerMenuItem icon={GitIcon} path="/sources/git" on:click={() => dispatch('navigate')}>
		Git
	</DrawerMenuItem>
	<DrawerMenuItem icon={DockerIcon} path="/sources/dockerhub" on:click={() => dispatch('navigate')}>
		DockerHub
	</DrawerMenuItem>
	<DrawerMenuItem icon={FolderOpenIcon} path="/sources/files" on:click={() => dispatch('navigate')}>
		Files
	</DrawerMenuItem>

	<li class="menu-title">
		<span>Settings</span>
	</li>

	<DrawerMenuItem icon={CogIcon} path="/settings" on:click={() => dispatch('navigate')}>
		Settings
	</DrawerMenuItem>
	<DrawerMenuItem icon={CheckCircleIcon} path="/check" on:click={() => dispatch('navigate')}>
		Health Check
	</DrawerMenuItem>
	<DrawerMenuItem icon={ViewListIcon} path="/logs" on:click={() => dispatch('navigate')}>
		Logs
	</DrawerMenuItem>


	<div class="mt-auto pt-8">
		<DrawerMenuItem icon={QuestionMarkCircleIcon} path="/docs" on:click={() => dispatch('navigate')}>
			Documentation
		</DrawerMenuItem>
	</div>
</ul>


<style lang="scss">
  .menu li {
	@apply mb-2 text-base-content font-semibold;
  }

  .menu-title {
	@apply mt-2 mb-2 flex-row;
	div {
	  @apply text-primary-content;
	}
  }
</style>
