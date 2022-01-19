<script lang="ts">
	import {page} from '$app/stores';
	import {
		Container,
		containers,
	} from '$lib/stores/containers';

	let container:Container = null;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

	$: network = container?.networks['light-whale-network'] ?? null;

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


<style lang="scss">

</style>
