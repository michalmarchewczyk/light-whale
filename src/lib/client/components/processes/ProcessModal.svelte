<script lang="ts">
	import type Process from '$lib/server/processes/Process';
	import { afterUpdate } from 'svelte';
	import ItemInfo from '$lib/client/components/ItemInfo.svelte';
	import BoltIcon from '$icons/bolt.svg';
	import Portal from '$lib/client/components/Portal.svelte';
	import { browser } from '$app/environment';
	import fetchStream from '$lib/client/utils/fetchStream';

	export let open = false;
	export let process: Process;

	let lines: string[] = [];

	$: {
		lines = process?.state === 'running' ? [] : [];
	}

	let progress = -1;

	$: progress = process?.progress ?? -1;

	let scrollContainer;

	$: {
		if (browser) {
			fetchStream(`/api/processes/${process?.id}`, (data) => {
				const strings = data.split('\n');
				for (const string of strings) {
					if (string.length > 0) {
						const data = JSON.parse(string);
						progress = data.progress;
						lines = lines.concat(data.newData.split('\n').filter((s) => s.length > 0));
					}
				}
			});
		}
	}

	afterUpdate(() => {
		if (scrollContainer) {
			scrollContainer.scrollTop = (process.data.split('\n').length + lines.length) * 100;
		}
	});
</script>

<Portal>
	<input type="checkbox" id="my-modal-2" class="modal-toggle" bind:checked={open} />
	<div class="modal">
		<div class="modal-box w-[64rem] max-w-full">
			<span class="text-lg mb-4 font-semibold w-full block">{process.title}</span>
			<ItemInfo icon={BoltIcon} class="mb-4">
				{#if process.state === 'done' || process.state === 'error'}
					Finished: {process.lastUpdated.toLocaleString()}
				{:else if progress === -1}
					<progress class="progress progress-primary" />
				{:else}
					<progress class="progress progress-primary" value={progress} max="100" />
				{/if}
			</ItemInfo>
			<span class="text-md mb-4 font-semibold w-full block">Progress data:</span>
			<div
				class="overflow-scroll whitespace-pre font-mono bg-base-200 font-medium max-h-96 h-96 mx-[-1.5rem]"
				bind:this={scrollContainer}
			>
				<div class="w-full">
					{#each [...process.data.split('\n'), ...lines] as line, i}
						<p
							class="px-5 py-1 text-base w-full inline-block float-left clear-both text-base-content bg-opacity-20"
							class:bg-base-300={i % 2 === 0}
						>
							{line}
						</p>
					{/each}
				</div>
			</div>
			<div class="modal-action">
				<button class="btn" on:click={() => (open = false)} type="button">Close</button>
			</div>
		</div>
	</div>
</Portal>
