<script lang="ts">
	import {page} from '$app/stores';
	import {Container, containers} from '$lib/stores/containers';

	import CubeIcon from '$icons/cube.svg';
	import ChartSquareBarIcon from '$icons/chart-square-bar.svg';
	import FolderIcon from '$icons/folder.svg';
	import ViewListIcon from '$icons/view-list.svg';
	import GlobeAltIcon from '$icons/globe-alt.svg';
	import PageHeader from '$lib/components/page/PageHeader.svelte';
	import PageMenu from '$lib/components/page/PageMenu.svelte';
	import PageMenuItem from '$lib/components/page/PageMenuItem.svelte';

	let container:Container;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));
</script>

<svelte:head>
	<title>Containers</title>
</svelte:head>

<PageHeader badge="{container?.state}"
			badgeClass="
			{container?.state === 'dead' || container?.state === 'removing' ? 'bg-error' : ''}
			{container?.state === 'created' ? 'bg-info' : ''}
			{container?.state === 'running' ? 'bg-success' : ''}
			{container?.state === 'paused' || container?.state === 'restarting' ? 'bg-warning' : ''}">

	<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/containers">Containers / </a>
	{$page.params.id}
</PageHeader>

<PageMenu>
	<PageMenuItem icon={CubeIcon} path="/containers/{$page.params.id}">
		General
	</PageMenuItem>
	<PageMenuItem icon={GlobeAltIcon} path="/containers/{$page.params.id}/network">
		Network
	</PageMenuItem>
	<PageMenuItem icon={ChartSquareBarIcon} path="/containers/{$page.params.id}/stats">
		Statistics
	</PageMenuItem>
	<PageMenuItem icon={FolderIcon} path="/containers/{$page.params.id}/files">
		Files
	</PageMenuItem>
	<PageMenuItem icon={ViewListIcon} path="/containers/{$page.params.id}/logs">
		Logs
	</PageMenuItem>
</PageMenu>

<div class="mx-4 mt-8 mb-8">
	<slot></slot>
</div>


