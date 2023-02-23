<script lang="ts">
	import type ContainerData from '$lib/server/docker/ContainerData';
	import Convert from 'ansi-to-html';
	import fetchStream from '$lib/client/utils/fetchStream';
	import { browser } from '$app/environment';
	import { afterUpdate } from 'svelte';
	const convert = new Convert();

	export let data: { container: ContainerData };

	let logs = [];
	let scrollContainer;

	$: {
		if (browser) {
			fetchStream(
				`/api/containers/${data?.container?.id}/logs`,
				(data) => {
					const strings = data.split('\n').filter((str) => str);
					const newLogs = strings.map((s) => convert.toHtml(s.slice(39)));
					logs = [...logs, ...newLogs];
				},
				() => {
					if (data?.container?.state === 'running') {
						logs = [];
					}
				},
				() => {
					if (data?.container?.state !== 'running' && logs.length > 0) {
						return true;
					}
				}
			);
		}
	}

	afterUpdate(() => {
		if (scrollContainer) {
			scrollContainer.scrollTop = scrollContainer.scrollTop = logs.length * 100;
		}
	});
</script>

<svelte:head>
	<title>Container Logs - Light-Whale</title>
</svelte:head>

<div class="card shadow-md bg-base-100 p-0 max-h-[calc(100vh-18rem)] overflow-hidden">
	<span class="mx-0 p-3 px-5 font-bold text-lg pb-3 border-b-2 mb-0">Container logs</span>
	<div
		class="overflow-scroll whitespace-pre font-mono bg-base-300 font-medium"
		bind:this={scrollContainer}
		data-theme="default-dark"
	>
		<div class="w-max w-full">
			{#each logs as log, i}
				<p
					class="px-5 py-1 text-base w-full inline-block float-left clear-both text-base-content bg-opacity-40"
					class:bg-base-200={i % 2 === 0}
				>
					{@html log}
				</p>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
</style>
