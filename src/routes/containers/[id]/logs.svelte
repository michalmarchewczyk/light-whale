<script lang="ts">
	import {page} from '$app/stores';
	import type {Container} from '$lib/client/stores/containers';
	import { containers} from '$lib/client/stores/containers';
	import {onMount} from 'svelte';

	let container:Container = null;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

	let loading = true;
	let logsData = '';
	let logs = [];
	let scrollContainer;

	const getLogs = async () => {
		if (!container?.id) return;
		const res = await fetch(`/api/docker/containers/${container.id}/logs?skipLogger=true`);
		if (res.status !== 200) return;
		const data = await res.text();
		logsData = data;
		logs = data.split('\n');
	};

	$: {
		if (scrollContainer) {
			scrollContainer.scrollTop = logsData.length * 100;
		}
	}

	onMount(() => {
		getLogs().then(() => {
			loading = false;
		});
		const interval = setInterval(getLogs, 1000);
		return () => {
			clearInterval(interval);
		};
	});

</script>

<div class="card shadow-md bg-base-100 p-0 max-h-[calc(100vh-18rem)] overflow-hidden">
	<span class="mx-0 p-3 px-5 font-bold text-lg pb-3 border-b-2 mb-0">Container logs</span>
	{#if loading}
		<p class="p-6 text-xl text-center">Loading...</p>
	{:else}
		<div class="overflow-scroll whitespace-pre font-mono bg-base-100" bind:this={scrollContainer}>
			<div class="w-max">
				{#each logs as log, i}
					<p class="px-5 py-1 text-base w-full inline-block float-left clear-both text-base-content"
					   class:bg-base-200={i%2===0}>{log.slice(8).trim()}</p>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">

</style>


