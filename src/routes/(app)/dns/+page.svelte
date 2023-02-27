<script lang="ts">
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import SortMenu from '$lib/client/components/lists/SortMenu.svelte';
	import type DnsZone from '$lib/server/dns/DnsZone';
	import DnsZoneItem from '$lib/client/components/dns/DnsZoneItem.svelte';
	import FilterMenu from '$lib/client/components/lists/FilterMenu.svelte';
	import type DnsRecord from '$lib/server/dns/DnsRecord';
	import DnsRecordItem from '$lib/client/components/dns/DnsRecordItem.svelte';

	export let data: { dns: { zones: Promise<DnsZone[]> } };

	let zones: DnsZone[] = [];

	let loading = true;

	$: {
		data?.dns.zones.then((z) => {
			zones = z;
			loading = false;
		});
	}

	let sort = '';
	let order = '';
	let group = 'zone';

	let filteredZones: DnsZone[] = [];
	let filteredRecords: DnsRecord[] = [];

	$: {
		filteredZones = zones;
		filteredRecords = zones.flatMap((zone) => zone.records);
		if (sort === 'name') {
			filteredZones = filteredZones.sort((a, b) => (a.name < b.name ? 1 : -1));
			filteredRecords = filteredRecords.sort((a, b) => (a.name < b.name ? 1 : -1));
		} else if (sort === 'modified') {
			filteredZones = filteredZones.sort((a, b) => (a.modifiedDate < b.modifiedDate ? 1 : -1));
			filteredRecords = filteredRecords.sort((a, b) => (a.modifiedDate < b.modifiedDate ? 1 : -1));
		}
		if (sort && order === 'asc') {
			filteredZones = filteredZones.reverse();
			filteredRecords = filteredRecords.reverse();
		}
	}
</script>

<svelte:head>
	<title>DNS - Light-Whale</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<ListHeader
		title="DNS"
		badge="{zones.flatMap((z) => z.records).length} records / {zones.length} zones"
	>
		<SortMenu bind:value={sort} bind:order values={['modified', 'name']} class="float-right" />
		<FilterMenu name="Group by" bind:value={group} values={['zone', 'none']} />
	</ListHeader>
</div>
<div class="p-8 pt-2">
	{#if loading}
		<p class="w-full text-center text-3xl pt-12 opacity-50">Loading...</p>
	{:else if group === 'zone'}
		{#each filteredZones as zone}
			<DnsZoneItem {zone} {sort} {order} />
		{:else}
			<p class="w-full text-center text-3xl pt-12 opacity-50">No zones found</p>
		{/each}
	{:else if group === 'none'}
		{#each filteredRecords as record}
			<DnsRecordItem {record} />
		{:else}
			<p class="w-full text-center text-3xl pt-12 opacity-50">No zones found</p>
		{/each}
	{/if}
</div>
