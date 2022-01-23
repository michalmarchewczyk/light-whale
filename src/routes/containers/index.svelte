<script lang="ts">
	import ContainerItem from '$lib/components/containers/ContainerItem.svelte';
	import ComposeAppItem from '$lib/components/containers/ComposeAppItem.svelte';
	import {ComposeApp, composeApps, Container, containers} from '$lib/stores/containers';
	import {page} from '$app/stores';
	import {paramsToLink} from '$lib/utils/paramsToLink';

	let appsAndContainers:(ComposeApp | Container)[];

	$: {
		let filteredApps = $composeApps;
		let filteredContainers = $containers.filter(c => !c.compose);
		if($page.url.searchParams.get('filter')){
			let filterName = $page.url.searchParams.get('filter');
			if(filterName === 'running'){
				filteredContainers = filteredContainers.filter(c => c.state === 'running');
				filteredApps = filteredApps.filter(app => app.containers.some(c => c.state === 'running'));
			}else if(filterName === 'created'){
				filteredContainers = filteredContainers.filter(c => c.state === 'created');
				filteredApps = filteredApps.filter(app => app.containers.some(c => c.state === 'created'));
			}else if(filterName === 'exited'){
				filteredContainers = filteredContainers.filter(c => c.state === 'exited');
				filteredApps = filteredApps.filter(app => app.containers.some(c => c.state === 'exited'));
			}else if(filterName === 'other'){
				filteredContainers = filteredContainers.filter(c => c.state !== 'running' && c.state !== 'created' && c.state !== 'exited');
				filteredApps = filteredApps.filter(app => app.containers.some(c => c.state !== 'running' && c.state !== 'created' && c.state !== 'exited'));
			}
		}
		appsAndContainers = [...filteredApps, ...filteredContainers].sort((a, b) => new Date(b.created) - new Date(a.created));
		if($page.url.searchParams.get('sort')){
			let sortName = $page.url.searchParams.get('sort');
			let sortOrder = $page.url.searchParams.get('order');
			if(sortName === 'name'){
				appsAndContainers = appsAndContainers.sort((a,b) => a.name < b.name ? 1 : -1);
			}else if(sortName === 'created'){
				appsAndContainers = appsAndContainers.sort((a,b) => a.created - b.created);
			}
			if(sortOrder === 'asc'){
				appsAndContainers = appsAndContainers.reverse();
			}
		}
	}
</script>

<svelte:head>
	<title>Containers</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<div class="text-3xl font-bold pb-4 border-b-2 border-base-300 mx-8 pt-6">
		Containers
		<div class="badge badge-lg float-right mt-1 text-lg h-8">
			{$containers.filter(c => c.state === 'running').length} / {$containers.length} running
		</div>
		<div class="w-full mt-4 text-base font-normal">
			<span class="text-lg font-semibold align-middle">Sort:</span>
			<div class="dropdown">
				<button class="select select-bordered bg-base-100 align-middle ml-2 w-44 capitalize">
					{#if $page.url.searchParams.get('sort')}
						<span class="mt-2 text-base">{$page.url.searchParams.get('sort')} ({$page.url.searchParams.get('order')})</span>
					{:else}
						<span class="mt-2 text-base">Created (desc)</span>
					{/if}
				</button>
				<ul class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-44 ml-2">
					<li><a href="{paramsToLink($page.url.search, {sort: 'created', order: 'asc'})}">
						Created (asc)
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {sort: 'created', order: 'desc'})}">
						Created (desc)
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {sort: 'name', order: 'asc'})}">
						Name (asc)
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {sort: 'name', order: 'desc'})}">
						Name (desc)
					</a></li>
				</ul>
			</div>
			<span class="text-lg font-semibold align-middle ml-4">Filter:</span>
			<div class="dropdown">
				<button class="select select-bordered bg-base-100 align-middle ml-2 w-36 capitalize">
					{#if $page.url.searchParams.get('filter')}
						<span class="mt-2 text-base">{$page.url.searchParams.get('filter')}</span>
					{:else}
						<span class="mt-2 text-base">All</span>
					{/if}
				</button>
				<ul class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-36 ml-2">
					<li><a href="{paramsToLink($page.url.search, {filter: 'all'})}">
						All
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {filter: 'running'})}">
						Running
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {filter: 'created'})}">
						Created
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {filter: 'exited'})}">
						Exited
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {filter: 'other'})}">
						Other
					</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>
<div class="p-8 pt-2">
	{#each appsAndContainers as appOrContainer}
		{#if 'containers' in appOrContainer}
			<ComposeAppItem app={appOrContainer}/>
		{:else}
			<ContainerItem container={appOrContainer}/>
		{/if}
	{:else}
		<p class="w-full text-center text-3xl pt-12 opacity-50">No containers</p>
	{/each}
</div>

<style lang="scss">

</style>
