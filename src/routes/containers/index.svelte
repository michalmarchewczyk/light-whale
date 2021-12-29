<script lang="ts">
	import {onMount} from 'svelte';
	import {composeApps, containers, fetchContainers} from '$lib/stores/docker';
	import type {ComposeApp, Container} from '$lib/stores/docker';
	import ContainerItem from './_ContainerItem.svelte';
	import ComposeAppItem from './_ComposeAppItem.svelte';

	onMount(async () => {
		await fetchContainers();
	});

	let appsAndContainers:(ComposeApp|Container)[];

	$: {
		appsAndContainers= [...$composeApps, ...$containers.filter(c => !c.compose)].sort((a,b) => new Date(b.created) - new Date(a.created));
	}
</script>

<svelte:head>
	<title>Containers</title>
</svelte:head>



<div>
	{#each appsAndContainers as appOrContainer}
		{#if 'containers' in appOrContainer}
			<ComposeAppItem key="{appOrContainer.name}" app={appOrContainer}/>
		{:else}
			<ContainerItem key={appOrContainer.id} container={appOrContainer}/>
		{/if}
	{/each}
</div>

<style lang="scss">

</style>
