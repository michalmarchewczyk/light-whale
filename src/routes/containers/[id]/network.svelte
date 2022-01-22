<script lang="ts">
	import {page} from '$app/stores';
	import {Container, containers,} from '$lib/stores/containers';
	import type {Site} from '$lib/stores/sites';
	import {sites} from '$lib/stores/sites';
	import SiteItem from '$lib/components/network/SiteItem.svelte';

	let container:Container;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

	$: network = container?.networks['light-whale-network'] ?? null;

	let connectedSites:Site[];

	$: connectedSites = $sites.filter(s => container?.id.startsWith(s.containerId));

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
