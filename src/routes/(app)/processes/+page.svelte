<script lang="ts">
	import type Process from '$lib/server/processes/Process';
	import ListHeader from '$lib/client/components/lists/ListHeader.svelte';
	import SortMenu from '$lib/client/components/lists/SortMenu.svelte';
	import FilterMenu from '$lib/client/components/lists/FilterMenu.svelte';
	import ProcessItem from '$lib/client/components/processes/ProcessItem.svelte';

	export let data: { processes: Process[] };

	let sort = '';
	let order = '';
	let status = '';

	let filteredProcesses: Process[] = [];

	$: {
		filteredProcesses = data.processes;
		if (status === 'done') {
			filteredProcesses = filteredProcesses.filter((p) => p.state === 'done');
		}
		if (status === 'running') {
			filteredProcesses = filteredProcesses.filter((p) => p.state === 'running');
		}
		if (status === 'error') {
			filteredProcesses = filteredProcesses.filter((p) => p.state === 'error');
		}
		if (sort === 'name') {
			filteredProcesses = filteredProcesses.sort((a, b) => (a.title < b.title ? 1 : -1));
		} else if (sort === 'started') {
			filteredProcesses = filteredProcesses.sort((a, b) => (a.started < b.started ? 1 : -1));
		}
		if (sort && order === 'asc') {
			filteredProcesses = filteredProcesses.reverse();
		}
	}
</script>

<svelte:head>
	<title>Processes - Light-Whale</title>
</svelte:head>

<div class="bg-base-200 top-0 sticky z-40 rounded-b-xl">
	<ListHeader title="Processes" badge="{data.processes.length} processes">
		<SortMenu bind:value={sort} bind:order values={['started', 'name']} class="float-right" />
		<FilterMenu
			name="status"
			bind:value={status}
			values={['all', 'done', 'running', 'error']}
			class="mr-4"
		/>
	</ListHeader>
</div>
<div class="p-8 pt-2">
	{#each filteredProcesses as process}
		<ProcessItem {process} />
	{:else}
		<p class="w-full text-center text-3xl pt-12 opacity-50">No processes</p>
	{/each}
</div>

<style lang="scss">
</style>
