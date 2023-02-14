<script lang="ts">
	import type ContainerData from '$lib/server/docker/ContainerData';
	import { onMount } from 'svelte';

	export let data: { container: ContainerData };

	let logs = [];

	let scrollContainer;

	let connected = false;

	onMount(() => {
		const interval = setInterval(fetchLogs, 1000);
		return () => {
			clearInterval(interval);
		};
	});

	const fetchLogs = () => {
		if (connected || (data?.container?.state !== 'running' && logs.length > 0)) {
			return;
		}
		connected = true;
		const writeStream = new WritableStream({
			start: () => {
				if (data?.container?.state === 'running') {
					logs = [];
				}
				connected = true;
			},
			write: (chunk) => {
				connected = true;
				const chunkStr = new TextDecoder().decode(chunk);
				const strings = chunkStr.split('\n').filter((str) => str);
				logs = [...logs, ...strings];
				setTimeout(() => {
					if (scrollContainer) {
						scrollContainer.scrollTop = logs.length * 100;
					}
				}, 40);
			},
			close: () => {
				connected = false;
			}
		});
		fetch(`/api/containers/${data?.container?.id}/logs`)
			.then((res) => res.body)
			.then((body) => {
				if (!body) {
					return;
				}
				body.pipeTo(writeStream);
			})
			.catch(() => {
				connected = false;
			});
	};
</script>

<div class="card shadow-md bg-base-100 p-0 max-h-[calc(100vh-18rem)] overflow-hidden">
	<span class="mx-0 p-3 px-5 font-bold text-lg pb-3 border-b-2 mb-0"
		>Container logs {connected ? 'true' : 'false'}</span
	>
	<div class="overflow-scroll whitespace-pre font-mono bg-base-100" bind:this={scrollContainer}>
		<div class="w-max">
			{#each logs as log, i}
				<p
					class="px-5 py-1 text-base w-full inline-block float-left clear-both text-base-content"
					class:bg-base-200={i % 2 === 0}
				>
					{log.slice(8).trim()}
				</p>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
</style>
