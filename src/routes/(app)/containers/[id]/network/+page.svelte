<script lang="ts">
	import FormError from '$lib/client/components/forms/FormError.svelte';
	import type { ActionData } from './$types';
	import type ContainerData from '$lib/server/docker/ContainerData';
	import SiteItem from '$lib/client/components/sites/SiteItem.svelte';
	import type SiteData from '$lib/server/sites/SiteData';
	import { enhance } from '$app/forms';

	export let form: ActionData;

	export let data: { container: ContainerData; containerSites: SiteData[] };

	let loading = false;

	$: network = data.container?.networks['light-whale-network'] ?? null;
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
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
		>
			<FormError error={form?.error} />
			<div class="form-control mb-0 w-full">
				<div class="flex space-x-4 mt-4 w-full">
					<label class="pl-0 flex flex-1 space-x-4">
						<span class="text-lg mb-0 mt-2 ">Domain: </span>
						<input
							class="input input-bordered w-full text-base"
							placeholder="example.com"
							type="text"
							name="domain"
						/>
					</label>
					<label class="pl-0 flex space-x-4">
						<span class="text-lg mb-0 mt-2 whitespace-nowrap">Application port: </span>
						<input
							class="input input-bordered w-full text-base w-32"
							placeholder="80"
							type="number"
							name="port"
						/>
					</label>
				</div>
			</div>
			<div class="card-actions mt-4">
				<input class="btn btn-primary" type="submit" value="Create" />
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
