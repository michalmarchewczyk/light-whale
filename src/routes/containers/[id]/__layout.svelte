<script lang="ts">
	import {page} from '$app/stores';
	import {containers} from '$lib/stores/containers';

	import CubeIcon from '$icons/cube.svg';
	import ChartBarIcon from '$icons/chart-bar.svg';
	import FolderIcon from '$icons/folder.svg';
	import DownloadIcon from '$icons/download.svg';

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

</script>

<svelte:head>
	<title>Containers</title>
</svelte:head>


<div class="bg-base-200 top-0 sticky z-40">
	<div class="text-3xl font-bold pb-4 mx-8 pt-6">
		<a class="text-3xl opacity-40 hover:text-primary-focus hover:opacity-100" href="/containers">Containers / </a>
		{$page.params.id}
		<div class="badge badge-lg float-right mt-1 text-lg h-8 border-none"
			 class:bg-info={container.state === 'created'}
			 class:bg-success={container.state === 'running'}
			 class:bg-warning={container.state === 'paused' || container.state === 'restarting'}
			 class:bg-error={container.state === 'dead' || container.state === 'removing'}>
			{container?.state}
		</div>
	</div>
</div>
<div class="mx-4">
	<ul class="menu items-stretch px-6 shadow-lg bg-base-100 horizontal rounded-box w-full mt-4">
		<li class:bordered={$page.path === `/containers/${$page.params.id}`}>
			<a href="/containers/{$page.params.id}/">
				<CubeIcon class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
				Info
			</a>
		</li>
		<li class:bordered={$page.path === `/containers/${$page.params.id}/stats`}>
			<a href="/containers/{$page.params.id}/stats">
				<ChartBarIcon class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
				Statistics
			</a>
		</li>
		<li class:bordered={$page.path === `/containers/${$page.params.id}/files`}>
			<a href="/containers/{$page.params.id}/files">
				<FolderIcon class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
				Files
			</a>
		</li>
		<li class:bordered={$page.path === `/containers/${$page.params.id}/backup`}>
			<a href="/containers/{$page.params.id}/backup">
				<DownloadIcon class="w-6 h-6 stroke-2 inline-block mr-2 opacity-80"/>
				Backup
			</a>
		</li>
	</ul>
</div>


<slot></slot>


