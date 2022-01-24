<script lang="ts">
	import {Site, sites} from '$lib/stores/sites';
	import SiteItem from '$lib/components/network/SiteItem.svelte';
	import {containers} from '$lib/stores/containers';
	import ListHeader from '$lib/components/lists/ListHeader.svelte';
	import SortMenu from '$lib/components/lists/SortMenu.svelte';
	import FilterMenu from '$lib/components/lists/FilterMenu.svelte';


	let onlineCount:number;
	$: onlineCount = $sites.filter(s =>
		!s.paused && $containers?.find(c => c.id.startsWith(s.containerId))?.state === 'running').length;

	let filteredSites:Site[];

	let sort = '';
	let order = '';
	let status = '';

	$: {
		filteredSites = $sites;
		if (status === 'online') {
			filteredSites = filteredSites.filter(s => !s.paused && $containers?.find(c => c.id.startsWith(s.containerId))?.state === 'running');
		} else if (status === 'disabled') {
			filteredSites = filteredSites.filter(s => s.paused);
		} else if (status === 'offline') {
			filteredSites = filteredSites.filter(s => !s.paused && $containers?.find(c => c.id.startsWith(s.containerId))?.state !== 'running');
		}
		if (sort === 'name') {
			filteredSites = filteredSites.sort((a, b) => a.domain < b.domain ? 1 : -1);
		} else if (sort === 'created') {
			filteredSites = filteredSites.sort((a, b) => a.created < b.created ? 1 : -1);
		}
		if (sort && order === 'asc') {
			filteredSites = filteredSites.reverse();
		}
	}

</script>

<svelte:head>
	<title>Sites</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<ListHeader title="Sites" badge="{onlineCount} / {$sites.length} online">
		<SortMenu bind:value={sort} bind:order={order} values="{['created', 'name']}" class="float-right"/>
		<FilterMenu name='used' bind:value={status} values="{['all', 'online', 'disabled', 'offline']}" class="mr-4"/>
	</ListHeader>
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
