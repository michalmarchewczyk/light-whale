<script lang="ts">
	import {sites} from '$lib/stores/sites';
	import SiteItem from '$lib/components/network/SiteItem.svelte';
	import {containers} from '$lib/stores/containers';


	let onlineCount:number;
	$: onlineCount = $sites.filter(s =>
		!s.paused && $containers?.find(c => c.id.startsWith(s.containerId))?.state === 'running').length;

</script>

<svelte:head>
	<title>Sites</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<div class="text-3xl font-bold pb-4 border-b-2 border-base-300 mx-8 pt-6">
		Sites
		<div class="badge badge-lg float-right mt-1 text-lg h-8">
			{onlineCount} / {$sites.length} online
		</div>
	</div>
</div>
<div class="p-8 pt-2">
	{#each $sites as site}
		<SiteItem site={site}/>
	{:else}
		<p class="w-full text-center text-3xl pt-12 opacity-50">No sites</p>
	{/each}
</div>

<style lang="scss">

</style>
