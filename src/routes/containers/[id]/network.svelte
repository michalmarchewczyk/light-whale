<script lang="ts">
	import {page} from '$app/stores';
	import {Container, containers,} from '$lib/client/stores/containers';
	import type {Site} from '$lib/client/stores/sites';
	import {addSite, sites} from '$lib/client/stores/sites';
	import SiteItem from '$lib/client/components/network/SiteItem.svelte';

	import FormError from '$lib/client/components/forms/FormError.svelte';

	let container:Container;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

	let network;
	$: network = container?.networks['light-whale-network'] ?? null;

	let connectedSites:Site[];

	$: connectedSites = $sites.filter(s => container?.id.startsWith(s.containerId));


	let domain = '';
	let port = 80;
	let error = '';


	const submit = async () => {
		await addSite(container?.id, domain, port);
	};

</script>

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
				<span class="font-bold">{network['IPAddress']}</span>
			</p>
		{/if}
	</div>
</div>

<div class="card shadow-md bg-base-100 mb-6">
	<div class="card-body p-6 pt-5">
		<h2 class="card-title text-xl">Create Site</h2>
		<form on:submit|preventDefault={submit}>
			<FormError error={error}/>
			<div class="form-control mb-0 w-full">
				<div class="flex space-x-4 mt-4 w-full">
					<label class="pl-0 flex flex-1 space-x-4">
						<span class="text-lg mb-0 mt-2 ">Domain: </span>
						<input bind:value={domain} class="input input-bordered w-full text-base" placeholder="domain"
							   type="text">
					</label>
					<label class="pl-0 flex space-x-4">
						<span class="text-lg mb-0 mt-2 whitespace-nowrap">Application port: </span>
						<input bind:value={port} class="input input-bordered w-full text-base w-32" placeholder="domain"
							   type="number">
					</label>
				</div>
			</div>
			<div class="card-actions">
				<input class="btn btn-primary" type="submit" value="Create"/>
			</div>
		</form>
	</div>
</div>

<div>
	<div class="text-2xl font-bold pb-0 mx-6 pt-2 opacity-80">
		Sites
	</div>
	{#each connectedSites as site}
		<SiteItem site={site}/>
	{:else}
		<p class="w-full text-center text-2xl pt-8 opacity-80">No sites are connected to this container</p>
	{/each}
</div>


<style lang="scss">

</style>
