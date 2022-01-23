<script lang="ts">
	import {Site, sites} from '$lib/stores/sites';
	import SiteItem from '$lib/components/network/SiteItem.svelte';
	import {containers} from '$lib/stores/containers';
	import {paramsToLink} from '$lib/utils/paramsToLink';
	import {page} from '$app/stores';


	let onlineCount:number;
	$: onlineCount = $sites.filter(s =>
		!s.paused && $containers?.find(c => c.id.startsWith(s.containerId))?.state === 'running').length;

	let filteredSites:Site[];

	$: {
		filteredSites = $sites;
		if($page.url.searchParams.get('status') === 'online'){
			filteredSites = filteredSites.filter(s => !s.paused && $containers?.find(c => c.id.startsWith(s.containerId))?.state === 'running');
		}
		if($page.url.searchParams.get('status') === 'disabled'){
			filteredSites = filteredSites.filter(s => s.paused);
		}
		if($page.url.searchParams.get('status') === 'offline'){
			filteredSites = filteredSites.filter(s => !s.paused && $containers?.find(c => c.id.startsWith(s.containerId))?.state !== 'running');
		}
		if($page.url.searchParams.get('sort')){
			let sortName = $page.url.searchParams.get('sort');
			let sortOrder = $page.url.searchParams.get('order');
			if(sortName === 'name'){
				filteredSites = filteredSites.sort((a,b) => a.domain < b.domain ? 1 : -1);
			}else if(sortName === 'created'){
				filteredSites = filteredSites.sort((a,b) => a.created < b.created ? 1 : -1);
			}
			if(sortOrder === 'asc'){
				filteredSites = filteredSites.reverse();
			}
		}
	}

</script>

<svelte:head>
	<title>Sites</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<div class="text-3xl font-bold pb-4 border-b-2 border-base-300 mx-8 pt-6">
		Sites
		<div class="badge badge-lg float-right mt-1 text-lg h-8">
			{onlineCount} / {$sites.length} online
		</div>
		<div class="w-full mt-6 text-base font-normal">
			<div class="float-right">
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
			</div>

			<span class="text-lg font-semibold align-middle">Status:</span>
			<div class="dropdown">
				<button class="select select-bordered bg-base-100 align-middle ml-2 w-36 capitalize">
					{#if $page.url.searchParams.get('status')}
						<span class="mt-2 text-base">{$page.url.searchParams.get('status')}</span>
					{:else}
						<span class="mt-2 text-base">All</span>
					{/if}
				</button>
				<ul class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-36 ml-2">
					<li><a href="{paramsToLink($page.url.search, {status: 'all'})}">
						All
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {status: 'online'})}">
						Online
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {status: 'disabled'})}">
						Disabled
					</a></li>
					<li><a href="{paramsToLink($page.url.search, {status: 'offline'})}">
						Offline
					</a></li>
				</ul>
			</div>
		</div>
	</div>
</div>
<div class="p-8 pt-2">
	{#each filteredSites as site}
		<SiteItem site={site}/>
	{:else}
		<p class="w-full text-center text-3xl pt-12 opacity-50">No sites</p>
	{/each}
</div>

<style lang="scss">

</style>
