<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';

	let loading = false;

	export let data: { logs: string[] };

	let logs: string[] = [];
	let logsFiltered: string[] = [];
	let logsLength = 0;

	let connected = false;
	const abortController = new AbortController();

	onMount(() => {
		const interval = setInterval(fetchLogs, 1000);
		return () => {
			clearInterval(interval);
			abortController.abort();
		};
	});

	const fetchLogs = () => {
		if (connected) {
			return;
		}
		connected = true;
		const writeStream = new WritableStream({
			start: () => {
				connected = true;
			},
			write: (chunk) => {
				connected = true;
				const chunkStr = new TextDecoder().decode(chunk);
				const strings = chunkStr.split('\n').filter((str) => str);
				logs = [...logs, ...strings];
			},
			close: () => {
				connected = false;
			}
		});
		fetch('/api/settings/logs', { signal: abortController.signal })
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

	let scrollContainer;
	let selectInfo = true;
	let selectWarning = true;
	let selectError = true;
	let selectVerbose = false;

	$: {
		logsFiltered = [...(data?.logs ?? []), ...logs];
		if (!selectInfo) {
			logsFiltered = logsFiltered.filter((log) => !log.includes('(Info)'));
		}
		if (!selectWarning) {
			logsFiltered = logsFiltered.filter((log) => !log.includes('(Warning)'));
		}
		if (!selectError) {
			logsFiltered = logsFiltered.filter((log) => !log.includes('(Error)'));
		}
		if (!selectVerbose) {
			logsFiltered = logsFiltered.filter((log) => !log.includes('(Verbose)'));
		}
		logsLength = logsFiltered.length;
	}

	afterUpdate(() => {
		if (scrollContainer) {
			scrollContainer.scrollTop = (data.logs.length + logs.length) * 100;
		}
	});
</script>

<svelte:head>
	<title>Logs - Light-Whale</title>
</svelte:head>

<div class="card shadow-lg bg-base-100 p-0 max-h-[calc(100vh-18rem)] overflow-hidden">
	<div class="mx-0 p-3 px-5 font-bold text-lg pb-3 border-b-2 mb-0">
		<span>Logs</span>
		<label class="inline cursor-pointer label float-right py-0 pt-0.5 ml-2">
			<input
				type="checkbox"
				bind:checked={selectVerbose}
				class="checkbox checkbox-primary mt-0.5 float-left"
			/>
			<span class="label-text ml-2 text-base font-semibold float-left">Verbose</span>
		</label>
		<label class="inline cursor-pointer label float-right py-0 pt-0.5 ml-2">
			<input
				type="checkbox"
				bind:checked={selectError}
				class="checkbox checkbox-primary mt-0.5 float-left"
			/>
			<span class="label-text ml-2 text-base font-semibold float-left">Error</span>
		</label>
		<label class="inline cursor-pointer label float-right py-0 pt-0.5 ml-2">
			<input
				type="checkbox"
				bind:checked={selectWarning}
				class="checkbox checkbox-primary mt-0.5 float-left"
			/>
			<span class="label-text ml-2 text-base font-semibold float-left">Warning</span>
		</label>
		<label class="inline cursor-pointer label float-right py-0 pt-0.5 ml-2">
			<input
				type="checkbox"
				bind:checked={selectInfo}
				class="checkbox checkbox-primary mt-0.5 float-left"
			/>
			<span class="label-text ml-2 text-base font-semibold float-left">Info</span>
		</label>
	</div>
	{#if loading}
		<p class="p-6 text-xl text-center">Loading...</p>
	{:else}
		<div class="overflow-scroll whitespace-pre font-mono bg-base-100" bind:this={scrollContainer}>
			<div class="w-max min-w-full">
				{#each logsFiltered as log, i}
					<p
						class="px-5 py-1 text-base w-full inline-block float-left clear-both text-base-content"
						class:bg-base-200={i % 2 === 0}
					>
						{log}
					</p>
				{/each}
			</div>
		</div>
	{/if}
</div>
