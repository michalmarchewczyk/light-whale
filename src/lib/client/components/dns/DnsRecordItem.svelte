<script lang="ts">
	import type DnsRecord from '$lib/server/dns/DnsRecord';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import CalendarIcon from '$icons/calendar.svg';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import TrashIcon from '$icons/trash.svg';
	import ExternalLinkIcon from '$icons/arrow-top-right-on-square.svg';
	import DocumentTextIcon from '$icons/document-text.svg';
	import GlobeAltIcon from '$icons/globe-alt.svg';
	import type SiteData from '$lib/server/sites/SiteData';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';

	export let record: DnsRecord;
	export let site: SiteData | undefined;

	let loading = false;
	let removeModal = false;
</script>

<div class="card shadow-lg my-4 bg-base-100 p-3 flex flex-row pl-0 h-28 overflow-hidden">
	<div class="block flex-auto w-64 overflow-hidden ml-5 mr-1 sm:mr-3 pr-1 sm:pr-4 ">
		<span
			class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl"
		>
			{record.name}
		</span>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1"
			>Content: <span class="font-bold">{record.content}</span></span
		>
		<span class="block w-full overflow-hidden overflow-ellipsis whitespace-nowrap mt-1"
			>ID: {record.id}</span
		>
	</div>
	<div class="block w-24 flex-auto overflow-hidden mr-2 sm:mr-3 pr-1 sm:pr-4">
		<ItemInfo icon={CalendarIcon}>
			{new Date(record.modifiedDate).toLocaleDateString()}
		</ItemInfo>
		<ItemInfo icon={DocumentTextIcon}>
			Type: {record.type}
		</ItemInfo>
		{#if site}
			<a href="/sites/{site.domain}" class="hover:text-primary-focus block">
				<ItemInfo icon={GlobeAltIcon}>
					Site: {site.domain}
				</ItemInfo>
			</a>
		{:else}
			<ItemInfo icon={GlobeAltIcon} class="italic">Site: not found</ItemInfo>
		{/if}
	</div>
	<div class="block w-32 overflow-visible flex-shrink-0">
		<ActionButton icon={TrashIcon} class="w-32 h-10" {loading} on:click={() => (removeModal = true)}
			>Remove</ActionButton
		>
		<RemoveModal
			label="this DNS record for"
			name={record.name}
			bind:open={removeModal}
			formaction="/dns?/remove"
			bind:loading
		>
			<input type="hidden" name="record_name" value={record.name} />
			<input type="hidden" name="record_content" value={record.content} />
		</RemoveModal>
		<ActionButton
			icon={ExternalLinkIcon}
			class="w-32 h-10 btn-ghost mt-2"
			href={`https://${record.name.replace('*.', '')}`}>Open</ActionButton
		>
	</div>
</div>
