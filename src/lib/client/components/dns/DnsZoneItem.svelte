<script lang="ts">
	import type DnsZone from '$lib/server/dns/DnsZone';
	import CalendarIcon from '$icons/calendar.svg';
	import CloudflareIcon from '$lib/client/assets/icons/cloudflare.svg';
	import DnsRecordItem from '$lib/client/components/dns/DnsRecordItem.svelte';
	import type DnsRecord from '$lib/server/dns/DnsRecord';
	import type SiteData from '$lib/server/sites/SiteData';

	export let zone: DnsZone;
	export let sites: SiteData[];

	export let sort = 'modified';
	export let order = 'desc';

	let filteredRecords: DnsRecord[] = [];

	$: {
		filteredRecords = zone.records;
		if (sort === 'name') {
			filteredRecords = filteredRecords.sort((a, b) => (a.name < b.name ? 1 : -1));
		} else if (sort === 'modified') {
			filteredRecords = filteredRecords.sort((a, b) => (a.modifiedDate < b.modifiedDate ? 1 : -1));
		}
		if (sort && order === 'asc') {
			filteredRecords = filteredRecords.reverse();
		}
	}
</script>

<div class="my-4 bg-neutral p-0 rounded-xl mx-[-1rem]">
	<div class="sticky top-[8.6rem] z-10 px-4 py-2 rounded-xl bg-neutral pb-3">
		<span class="text-xl font-bold ml-2 text-neutral-content">{zone.name}</span>
		{#if zone.provider === 'cloudflare'}
			<CloudflareIcon class="h-6 w-auto text-neutral-content ml-4 inline-block mt-[-0.5rem]" />
		{/if}
		<div
			class="block h-7 w-auto float-right mb-0.5 tooltip tooltip-left text-neutral-content text-base font-bold mt-0.5 mr-4"
			data-tip="Last modified"
		>
			<CalendarIcon
				class="h-5 w-5 inline-block float-left mt-0.5 stroke-[2.5px]"
				xmlns="http://www.w3.org/2000/svg"
			/>
			<span
				class="inline-block float-left overflow-hidden overflow-ellipsis whitespace-nowrap ml-1.5 text-right"
			>
				{new Date(zone.modifiedDate).toLocaleDateString()}
			</span>
		</div>
	</div>
	<div class="px-4 pb-1 mt-[-1rem]">
		{#each filteredRecords as record}
			<DnsRecordItem {record} site={sites.find((s) => s.domain === record.name)} />
		{/each}
	</div>
</div>
