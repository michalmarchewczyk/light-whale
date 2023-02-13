<script lang="ts">
	import PageMenu from '$lib/client/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/client/components/page/PageMenuItem.svelte';
	import PageHeader from '$lib/client/components/page/PageHeader.svelte';

	import CubeIcon from '$icons/cube.svg';
	import ChartSquareBarIcon from '$icons/chart-bar-square.svg';
	import FolderIcon from '$icons/folder.svg';
	import ListBulletIcon from '$icons/list-bullet.svg';
	import GlobeAltIcon from '$icons/globe-alt.svg';
	import type ContainerData from '$lib/server/docker/ContainerData';
	import { page } from '$app/stores';

	export let data: { container: ContainerData };
</script>

<svelte:head>
	<title>Container - Light-Whale</title>
</svelte:head>

<PageHeader
	badge={data.container?.state}
	badgeClass="
			{data.container?.state === 'dead' || data.container?.state === 'removing' ? 'bg-error' : ''}
			{data.container?.state === 'created' ? 'bg-info' : ''}
			{data.container?.state === 'running' ? 'bg-success' : ''}
			{data.container?.state === 'paused' || data.container?.state === 'restarting' ? 'bg-warning' : ''}"
>
	<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/containers"
		>Containers /
	</a>
	{$page.params.id}
</PageHeader>

<PageMenu>
	<PageMenuItem icon={CubeIcon} path="/containers/{$page.params.id}">General</PageMenuItem>
	<PageMenuItem icon={GlobeAltIcon} path="/containers/{$page.params.id}/network">
		Network
	</PageMenuItem>
	<PageMenuItem icon={ChartSquareBarIcon} path="/containers/{$page.params.id}/stats">
		Statistics
	</PageMenuItem>
	<PageMenuItem icon={FolderIcon} path="/containers/{$page.params.id}/files">Files</PageMenuItem>
	<PageMenuItem icon={ListBulletIcon} path="/containers/{$page.params.id}/logs">Logs</PageMenuItem>
</PageMenu>

<div class="mx-4 mt-8 mb-8">
	<slot />
</div>
