<script lang="ts">
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import TrashIcon from '$icons/trash.svg';
	import CalendarIcon from '$icons/calendar.svg';
	import { enhance } from '$app/forms';
	import RemoveModal from '$lib/client/components/RemoveModal.svelte';
	import CloudflareIcon from '$lib/client/assets/icons/cloudflare.svg';
	import OvhCloudIcon from '$lib/client/assets/icons/ovhcloud.svg';
	import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';

	export let token: DnsProviderToken;

	let loading = false;

	let removeModal = false;
</script>

<tr>
	<td class="flex items-center space-x-4 h-[6.1rem]">
		<div>
			<div class="text-lg font-bold">{token.name}</div>
			<div class="text-base opacity-50">{token.login}</div>
		</div>
	</td>
	<td class="w-80">
		<span
			class="w-80 {token.description ? '' : 'italic'} block mb-1 overflow-hidden overflow-ellipsis"
		>
			{token.description.length ? decodeURIComponent(token.description) : 'no description'}
		</span>
		<ItemInfo class="w-48" icon={CalendarIcon}>{new Date(token.date).toLocaleString()}</ItemInfo>
	</td>
	<td class="w-24">
		{#if token.service === 'cloudflare'}
			<CloudflareIcon class="w-24 h-8" />
		{:else if token.service === 'ovh'}
			<OvhCloudIcon class="w-24 h-8" />
		{/if}
	</td>
	<td class="w-44">
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
		>
			<input type="hidden" name="id" value={token.id} />
			<ActionButton
				class="w-32 float-right"
				{loading}
				icon={TrashIcon}
				type="button"
				on:click={() => (removeModal = true)}>Remove</ActionButton
			>
			<RemoveModal
				bind:open={removeModal}
				formaction="/settings/dns?/removeToken"
				name={token.login}
				label="{token.service} token for"
				confirmPassword="true"
				bind:loading
			>
				<input type="hidden" name="id" value={token.id} />
			</RemoveModal>
		</form>
	</td>
</tr>
