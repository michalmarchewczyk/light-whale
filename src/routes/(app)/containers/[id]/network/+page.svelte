<script lang="ts">
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import type { ActionData, PageData } from './$types';
	import SiteItem from '$lib/client/components/sites/SiteItem.svelte';
	import { enhance } from '$app/forms';
	import ActionButton from '$lib/client/components/ActionButton.svelte';
	import PlusIcon from '$icons/plus.svg';
	import CheckCard from '$lib/client/components/CheckCard.svelte';
	import LinkIcon from '$icons/link.svg';

	export let form: ActionData;

	export let data: PageData;

	let loading = false;

	$: network = data?.container?.networks['light-whale-network'] ?? null;

	let selectedZone = 'Custom';

	data.info.zones.then((zones) => {
		selectedZone = zones[0]?.name ?? 'Custom';
	});

	let domainInput: HTMLInputElement;

	let defaultPort = 80;
	let port = defaultPort;

	data.info.ports.then((ports) => {
		port = parseInt(ports[0] ?? '80', 10) ?? 80;
		defaultPort = port;
	});
</script>

<svelte:head>
	<title>Container Network - Light-Whale</title>
</svelte:head>

<CheckCard
	class="mb-6"
	title={(!network ? 'Not' : '') + ' Connected to Light-Whale internal network'}
	status={!network ? 'warning' : 'success'}
	msg={network
		? `IP Address: ${network['IPAddress'] || '-'}`
		: 'Connect container to Light-Whale internal network to access sites'}
>
	{#if !network}
		<form
			action="?/connect"
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<ActionButton class="w-32" icon={LinkIcon} {loading}>Connect</ActionButton>
		</form>
	{/if}
</CheckCard>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Create Site</h2>
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
					port = 0;
					port = defaultPort;
				};
			}}
		>
			<FormError error={form?.error} />
			<div class="form-control mb-0 w-full">
				<div class="flex space-x-4 mt-4 w-full">
					<label class="pl-0 flex flex-1 space-x-4">
						<span class="text-lg mb-0 mt-2">Domain: </span>
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
										<span class="text-base bg-base-100 px-0 mt-2.5 mb-2.5 italic">Custom</span>
									{:else}
										<span class="text-base bg-base-100 px-0 mt-2.5 mb-2.5">.{selectedZone}</span>
									{/if}
								</button>
								<ul
									class="menu dropdown-content bg-base-100 rounded-box shadow-xl font-semibold w-full"
								>
									{#await data.info.zones then zones}
										{#each zones as zone}
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
									{/await}
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
					<div class="dropdown dropdown-end">
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
							{#await data.info.ports then ports}
								{#each ports as p}
									<li class="w-full overflow-hidden overflow-ellipsis">
										<button
											type="button"
											on:click={() => {
												port = parseInt(p.split(' ')[0], 10);
												domainInput.focus();
											}}
											class="w-full overflow-hidden overflow-ellipsis"
										>
											{p}
										</button>
									</li>
								{/each}
							{/await}
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
