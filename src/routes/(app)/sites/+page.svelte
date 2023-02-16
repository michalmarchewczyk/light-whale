<script lang="ts">
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import SortMenu from '$lib/client/components/lists/SortMenu.svelte';
	import FilterMenu from '$lib/client/components/lists/FilterMenu.svelte';
	import SiteItem from '$lib/client/components/sites/SiteItem.svelte';
	import type SiteData from '$lib/server/sites/SiteData';
	import type ContainerData from '$lib/server/docker/ContainerData';

	export let data: { sites: SiteData[]; containers: ContainerData[] };

	let sort = '';
	let order = '';
	let status = '';

	let onlineCount = 0;

	let filteredSites: SiteData[] = [];

	$: {
		filteredSites = data.sites;
		if (status === 'online') {
			filteredSites = filteredSites.filter(
				(s) =>
					!s.paused &&
					data.containers?.find((c) => c.id.startsWith(s.containerId))?.state === 'running'
			);
		} else if (status === 'disabled') {
			filteredSites = filteredSites.filter((s) => s.paused);
		} else if (status === 'offline') {
			filteredSites = filteredSites.filter(
				(s) =>
					!s.paused &&
					data.containers?.find((c) => c.id.startsWith(s.containerId))?.state !== 'running'
			);
		}
		if (sort === 'name') {
			filteredSites = filteredSites.sort((a, b) => (a.domain < b.domain ? 1 : -1));
		} else if (sort === 'created') {
			filteredSites = filteredSites.sort((a, b) => (a.created < b.created ? 1 : -1));
		}
		if (sort && order === 'asc') {
			filteredSites = filteredSites.reverse();
		}
	}
</script>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<ListHeader title="Sites" badge="{onlineCount} / {data.sites.length} online">
		<SortMenu bind:value={sort} bind:order values={['created', 'name']} class="float-right" />
		<FilterMenu
			name="status"
			bind:value={status}
			values={['all', 'online', 'disabled', 'offline']}
			class="mr-4"
		/>
	</ListHeader>
</div>
<div class="p-8 pt-2">
	{#each filteredSites as site}
		<SiteItem {site} container={data.containers.find((c) => site.containerId === c.id)} />
	{:else}
		<p class="w-full text-center text-3xl pt-12 opacity-50">No sites</p>
	{/each}
</div>
