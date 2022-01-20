<script lang="ts">
	import ContainerItem from '$lib/components/containers/ContainerItem.svelte';
	import ComposeAppItem from '$lib/components/containers/ComposeAppItem.svelte';
	import {ComposeApp, composeApps, Container, containers} from '$lib/stores/containers';

	let appsAndContainers:(ComposeApp | Container)[];

	$: {
		appsAndContainers = [...$composeApps, ...$containers.filter(c => !c.compose)].sort((a, b) => new Date(b.created) - new Date(a.created));
	}
</script>

<svelte:head>
	<title>Containers</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<div class="text-3xl font-bold pb-4 border-b-2 border-base-300 mx-8 pt-6">
		Containers
		<div class="badge badge-lg float-right mt-1 text-lg h-8">
			{$containers.filter(c => c.state === 'running').length} / {$containers.length} running
		</div>
	</div>
</div>
<div class="p-8 pt-2">
	{#each appsAndContainers as appOrContainer}
		{#if 'containers' in appOrContainer}
			<ComposeAppItem app={appOrContainer}/>
		{:else}
			<ContainerItem container={appOrContainer}/>
		{/if}
	{:else}
		<p class="w-full text-center text-3xl pt-12 opacity-50">No containers</p>
	{/each}
</div>

<style lang="scss">

</style>
