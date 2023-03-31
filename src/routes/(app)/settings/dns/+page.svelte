<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import CloudflareIcon from '$lib/client/assets/icons/cloudflare.svg';
	import OvhCloudIcon from '$lib/client/assets/icons/ovhcloud.svg';
	import DnsProviderTokenItem from '$lib/client/components/dns/DnsProviderTokenItem.svelte';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import TrashIcon from '$icons/trash.svg';
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let publicIp = '';

	let loading = false;

	export let form: ActionData;

	let selectedService = 'Cloudflare';

	let tokenInput: HTMLInputElement;

	let ipSettingsForm: HTMLFormElement;
</script>

<svelte:head>
	<title>DNS Settings - Light-Whale</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">DNS Providers Tokens</h2>
		<table class="table w-full mt-2 mb-0">
			<tbody>
				{#each data.tokens as token}
					<DnsProviderTokenItem {token} />
				{:else}
					<p class="w-full text-center text-3xl p-4 opacity-50">No tokens saved</p>
				{/each}
			</tbody>
		</table>
		<div class="divider mb-1 mt-0  mx-[-1.5rem]" />
		<form
			method="POST"
			action="?/addToken"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
		>
			<span class="text-lg font-semibold mb-4 block">Add Token</span>
			<FormError error={form?.error} />
			<div class="flex space-x-4">
				<label class="w-32">
					<input type="hidden" name="service" value={selectedService.toLowerCase()} />
					<div class="dropdown flex-1 w-32">
						<button class="select select-bordered bg-base-100 align-middle w-full" type="button">
							<span class="mt-2 text-base">
								{#if selectedService === 'Cloudflare'}
									<CloudflareIcon class="w-20 h-8 ml-[-0.25rem]" />
								{:else if selectedService === 'OVH'}
									<OvhCloudIcon class="w-20 h-8 ml-[-0.25rem]" />
								{/if}
							</span>
						</button>
						<ul
							class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-full"
						>
							<li>
								<button
									on:click={() => {
										selectedService = 'Cloudflare';
										tokenInput.focus();
									}}
									type="button"
								>
									<CloudflareIcon class="w-24 h-8" /></button
								>
							</li>
							<li>
								<button
									on:click={() => {
										selectedService = 'OVH';
										tokenInput.focus();
									}}
									type="button"
								>
									<OvhCloudIcon class="w-24 h-8" /></button
								>
							</li>
						</ul>
					</div>
				</label>
				{#each data.tokenFields[selectedService.toLowerCase()] as field, index}
					<label class="input-group flex-1">
						<span class="capitalize  whitespace-nowrap">{field}: </span>
						{#if index === 0}
							<input
								name={field}
								type="text"
								placeholder={field}
								class="input input-bordered text-base w-full"
								bind:this={tokenInput}
							/>
						{:else}
							<input
								name={field}
								type="text"
								placeholder={field}
								class="input input-bordered text-base w-full"
							/>
						{/if}
					</label>
				{/each}
			</div>
			<div class="flex space-x-4 mt-4 w-full justify-end">
				<label class="input-group flex-1">
					<span>Description: </span>
					<input
						name="description"
						type="text"
						placeholder="description"
						class="input input-bordered text-base w-full"
					/>
				</label>
				<label class="pl-0 flex flex-0 space-x-4">
					<span class="text-lg mb-0 mt-2 whitespace-nowrap">Confirm Password: </span>
					<input
						name="password"
						class="input input-bordered w-full text-base"
						placeholder="password"
						type="password"
					/>
				</label>
				<button class="flex-none btn btn-primary cursor-pointer" disabled={loading} class:loading>
					Add
				</button>
			</div>
		</form>
	</div>
</div>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl mb-2">IP Address Settings</h2>
		<form
			method="POST"
			action="?/updateIpSettings"
			bind:this={ipSettingsForm}
			use:enhance={() => {
				return () => null;
			}}
		>
			<label class="flex align-middle items-center justify-between h-10">
				<span class="text-lg"
					>Automatically add and delete DNS records with saved public IP addresses</span
				>
				<input
					type="checkbox"
					class="toggle mt-1 toggle-primary"
					checked={data?.ipSettings.autoAddIp}
					name="autoAdd"
					on:change={() => {
						ipSettingsForm.requestSubmit();
					}}
				/>
			</label>
		</form>
		<div class="divider mb-1 mt-2  mx-[-1.5rem]" />
		<span class="text-lg font-semibold mb-0 block">Saved IP addresses:</span>
		<table class="table w-full mt-2 mb-4">
			<tbody>
				{#each [...data.ipSettings.v4addresses, ...data.ipSettings.v6addresses] as address}
					<tr>
						<td class="flex items-center space-x-4 h-16">
							<div class="flex-1">
								<div class="text-lg font-bold">{address}</div>
							</div>
							<form
								method="POST"
								action="?/removeIp"
								use:enhance={() => {
									loading = true;
									return async ({ update }) => {
										await update();
										loading = false;
									};
								}}
							>
								<input type="hidden" name="address" value={address} />
								<ActionButton class="w-32 float-right" {loading} icon={TrashIcon}
									>Remove</ActionButton
								>
							</form>
						</td>
					</tr>
				{:else}
					<p class="w-full text-center text-3xl p-4 opacity-50">No addresses saved</p>
				{/each}
			</tbody>
		</table>
		<form
			method="POST"
			action="?/addIp"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
		>
			<FormError error={form?.ipError} />
			<div class="flex space-x-4">
				<label class="input-group flex-1">
					<span class="whitespace-nowrap">New address: </span>
					<input
						name="address"
						type="text"
						bind:value={publicIp}
						placeholder="0.0.0.0"
						class="input input-bordered text-base w-full"
					/>
				</label>
				<button
					class="flex-none btn cursor-pointer btn-outline"
					class:loading
					type="button"
					on:click={async () => {
						loading = true;
						await invalidate('app:dns');
						data.ipSettings.publicIp.then((ip) => {
							publicIp = ip ?? '';
							loading = false;
						});
					}}
				>
					Detect
				</button>
				<button class="flex-none btn btn-primary cursor-pointer" disabled={loading} class:loading>
					Add
				</button>
			</div>
		</form>
	</div>
</div>
