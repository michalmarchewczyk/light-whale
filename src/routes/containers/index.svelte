<script lang="ts">
	import ContainerItem from '$lib/client/components/containers/ContainerItem.svelte';
	import ComposeAppItem from '$lib/client/components/containers/ComposeAppItem.svelte';
	import {ComposeApp, composeApps, Container, containers} from '$lib/client/stores/containers';
	import FilterMenu from '$lib/client/components/lists/FilterMenu.svelte';
	import SortMenu from '$lib/client/components/lists/SortMenu.svelte';
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';

	let appsAndContainers:(ComposeApp | Container)[];

	let type = '';
	let state = '';
	let sort = '';
	let order = '';

	$: {
		let filteredApps = $composeApps;
		let filteredContainers = $containers.filter(c => !c.compose);

		if(['running', 'created', 'exited'].includes(state)){
			filteredContainers = filteredContainers.filter(c => c.state === state);
			filteredApps = filteredApps.filter(app => app.containers.some(c => c.state === state));
		} else if (state === 'other') {
			filteredContainers = filteredContainers.filter(c => !['running', 'created', 'exited'].includes(c.state));
			filteredApps = filteredApps.filter(app => app.containers.some(c => !['running', 'created', 'exited'].includes(c.state)));
		}

		if (type === 'container') {
			filteredApps = [];
		}
		if (type === 'app') {
			filteredContainers = [];
		}

		appsAndContainers = [...filteredApps, ...filteredContainers].sort((a, b) => new Date(b.created) - new Date(a.created));

		if (sort === 'name') {
			appsAndContainers = appsAndContainers.sort((a, b) => a.name < b.name ? 1 : -1);
		} else if (sort === 'created') {
			appsAndContainers = appsAndContainers.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1);
		}
		if (sort && order === 'asc') {
			appsAndContainers = appsAndContainers.reverse();
		}
	}
</script>

<svelte:head>
	<title>Containers</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<ListHeader title="Containers"
			badge="{$containers.filter(c => c.state === 'running').length} / {$containers.length} running">
		<SortMenu bind:value={sort} bind:order={order} values="{['created', 'name']}" class="float-right"/>
		<FilterMenu name='type' bind:value={type} values="{['all', 'container', 'app']}" class="mr-4"/>
		<FilterMenu name='state' bind:value={state} values="{['all', 'running', 'created', 'exited', 'other']}"/>
	</ListHeader>
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
