<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import HomeIcon from '$icons/home.svg';
	import CubeIcon from '$icons/cube.svg';
	import DiscIcon from '$lib/client/assets/icons/disc.svg';
	import GlobeAltIcon from '$icons/globe-alt.svg';
	import GlobeIcon from '$icons/globe-europe-africa.svg';
	import CogIcon from '$icons/cog-6-tooth.svg';
	// import FolderIcon from '$icons/folder.svg';
	import GitIcon from '$lib/client/assets/icons/git.svg';
	import DockerIcon from '$lib/client/assets/icons/docker.svg';
	import QuestionMarkCircleIcon from '$icons/question-mark-circle.svg';
	import RectangleStackIcon from '$icons/rectangle-stack.svg';
	import { status } from '$lib/client/stores/status';
	import DrawerMenuItem from '$lib/client/components/layout/DrawerMenuItem.svelte';

	const dispatch = createEventDispatcher();
	let online: boolean;
	$: online =
		!!$status?.lwNetwork && $status.lwNginxContainer.running && $status.lwNginxContainer.connected;
</script>

<ul
	class="menu menu-compact flex-nowrap p-4 px-4 overflow-y-auto bg-base-100 w-60 shadow-r-lg lg:shadow-none lg:border-r-2 lg:border-base-300 pb-2 max-h-[calc(100%)] lg:max-h-full"
>
	<DrawerMenuItem icon={HomeIcon} path="/" on:click={() => dispatch('navigate')}>
		Home
	</DrawerMenuItem>

	<li class="menu-title">
		<span>Docker</span>
		<div class="badge mt-0.5 {$status?.dockerPing ? 'badge-success' : 'badge-error'}">
			{$status?.dockerPing ? 'Connected' : 'Disconnected'}
		</div>
	</li>

	<DrawerMenuItem icon={CubeIcon} path="/containers" on:click={() => dispatch('navigate')}>
		Containers
	</DrawerMenuItem>
	<DrawerMenuItem icon={DiscIcon} path="/images" on:click={() => dispatch('navigate')}>
		Images
	</DrawerMenuItem>

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
	<!--	<DrawerMenuItem icon={FolderIcon} path="/sources/files" on:click={() => dispatch('navigate')}>-->
	<!--		Files-->
	<!--	</DrawerMenuItem>-->

	<li class="menu-title">
		<span>Settings</span>
	</li>

	<DrawerMenuItem icon={CogIcon} path="/settings" on:click={() => dispatch('navigate')}>
		Settings
	</DrawerMenuItem>

	<DrawerMenuItem icon={RectangleStackIcon} path="/processes" on:click={() => dispatch('navigate')}>
		Processes
	</DrawerMenuItem>

	<div class="mt-auto pt-8">
		<DrawerMenuItem
			icon={QuestionMarkCircleIcon}
			path="/docs"
			on:click={() => dispatch('navigate')}
		>
			Documentation
		</DrawerMenuItem>
	</div>
</ul>

<style lang="scss">
	.menu li {
		@apply mb-2 text-base-content font-semibold;
	}
	.menu-title {
		@apply mt-2 mb-2 flex-row opacity-100;
		span {
			@apply opacity-60;
		}
		div {
			@apply text-primary-content;
		}
	}
</style>
