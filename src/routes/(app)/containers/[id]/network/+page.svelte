<script lang="ts">
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import type { ActionData } from './$types';
	import type ContainerData from '$lib/server/docker/ContainerData';
	import SiteItem from '$lib/client/components/sites/SiteItem.svelte';
	import type SiteData from '$lib/server/sites/SiteData';
	import { enhance } from '$app/forms';
	import type DnsZone from '$lib/server/dns/DnsZone';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import PlusIcon from '$icons/plus.svg';

	export let form: ActionData;

	export let data: {
		container: ContainerData;
		containerSites: SiteData[];
		zones: DnsZone[];
		ports: string[];
	};

	let loading = false;

	$: network = data?.container?.networks['light-whale-network'] ?? null;

	let selectedZone = data?.zones[0]?.name ?? 'Custom';

	let domainInput: HTMLInputElement;

	let port: number = parseInt(data?.ports[0] ?? '80', 10) ?? 80;
</script>

<svelte:head>
	<title>Container Network - Light-Whale</title>
</svelte:head>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Network</h2>
		<p class="text-lg">
			Connected to Light-Whale's internal network:
			<span class="font-bold">{!!network}</span>
		</p>
		{#if network}
			<p class="text-lg">
				IPv4 Address:
				<span class="font-bold">{network['IPAddress'] || '-'}</span>
			</p>
		{/if}
	</div>
</div>
<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Create Site</h2>
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<FormError error={form?.error} />
			<div class="form-control mb-0 w-full">
				<div class="flex space-x-4 mt-4 w-full">
					<label class="pl-0 flex flex-1 space-x-4">
						<span class="text-lg mb-0 mt-2 ">Domain: </span>
						<label class="input-group">
							<input
								class="input input-bordered w-full text-base"
								placeholder={selectedZone === 'Custom' ? 'example.com' : 'subdomain'}
								type="text"
								name="domain"
								bind:this={domainInput}
							/>
							<input type="hidden" name="zone" bind:value={selectedZone} />
							<div class="dropdown w-64">
								<button
									class="select select-bordered bg-base-100 align-middle w-full rounded-l-none"
									type="button"
								>
									{#if selectedZone === 'Custom'}
										<span class="text-base bg-base-100 px-0 mt-2.5 italic">Custom</span>
									{:else}
										<span class="text-base bg-base-100 px-0 mt-2.5">.{selectedZone}</span>
									{/if}
								</button>
								<ul
									class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-full"
								>
									{#each data.zones as zone}
										<li>
											<button
												type="button"
												on:click={() => {
													selectedZone = zone.name;
													domainInput.focus();
												}}
											>
												.{zone.name}
											</button>
										</li>
									{/each}
									<li>
										<button
											type="button"
											class="italic"
											on:click={() => {
												selectedZone = 'Custom';
												domainInput.focus();
											}}
										>
											Custom
										</button>
									</li>
								</ul>
							</div>
						</label>
					</label>
					<div class="dropdown  dropdown-end">
						<label class="pl-0 flex space-x-4" tabindex="0">
							<span class="text-lg mb-0 mt-2 whitespace-nowrap">Application port: </span>
							<input
								class="input input-bordered text-base w-32"
								placeholder="80"
								type="number"
								name="port"
								bind:value={port}
							/>
						</label>
						<ul
							tabindex="0"
							class="dropdown-content menu bg-base-100 rounded-box shadow-xl font-semibold w-32 whitespace-nowrap overflow-hidden overflow-ellipsis"
						>
							{#each data.ports as p}
								<li class="w-full overflow-hidden overflow-ellipsis">
									<button
										type="button"
										on:click={() => {
											port = parseInt(p.split(' ')[0], 10);
										}}
										class="w-full overflow-hidden overflow-ellipsis"
									>
										{p}
									</button>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
			<div class="card-actions mt-4">
				<ActionButton {loading} disabled={loading} class="w-28" icon={PlusIcon}>
					Create
				</ActionButton>
			</div>
		</form>
	</div>
</div>
<div>
	<div class="text-2xl font-bold pb-0 mx-6 pt-2 opacity-80">Sites</div>
	{#each data.containerSites as site}
		<SiteItem {site} container={data.container} />
	{:else}
		<p class="w-full text-center text-2xl pt-8 opacity-80">
			No sites are connected to this container
		</p>
	{/each}
</div>
