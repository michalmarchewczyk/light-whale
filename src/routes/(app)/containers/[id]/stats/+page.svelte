<script lang="ts">
	import type ContainerData from '$lib/server/docker/ContainerData';
	import StatsCard from '$lib/client/components/containers/StatsCard.svelte';

	import ChipIcon from '$icons/cpu-chip.svg';
	import CircleStackIcon from '$icons/circle-stack.svg';
	import CloudDownloadIcon from '$icons/cloud-arrow-down.svg';
	import CloudUploadIcon from '$icons/cloud-arrow-up.svg';
	import PuzzleIcon from '$icons/puzzle-piece.svg';

	import { bytesToHuman } from '$lib/client/utils/bytesToHuman';
	import { browser } from '$app/environment';
	import fetchStream from '$lib/client/utils/fetchStream';

	export let data: { container: ContainerData };

	let stats = {};

	$: {
		if (browser) {
			fetchStream(
				`/api/containers/${data?.container?.id}/stats`,
				(data) => {
					stats = JSON.parse(data);
				},
				null,
				() => {
					if (data?.container?.state !== 'running') {
						return true;
					}
				}
			);
		}
	}
</script>

<svelte:head>
	<title>Container Stats - Light-Whale</title>
</svelte:head>

{#if data.container?.state === 'running'}
	<div class="w-full shadow-md bg-base-100 stats grid-cols-3">
		<StatsCard
			icon={ChipIcon}
			title="CPU Usage"
			value={stats.cpu || stats.cpu === 0 ? stats.cpu?.toFixed(2) + ' %' : '-'}
		/>
		<StatsCard icon={ChipIcon} title="Active CPU Cores" value={stats.cores ?? '-'} />
		<StatsCard
			icon={CircleStackIcon}
			title="Memory Usage"
			value={stats.memory ? bytesToHuman(stats.memory) : '-'}
		/>
	</div>
	<div class="w-full shadow-md bg-base-100 stats grid-cols-3 mt-6">
		<StatsCard
			icon={PuzzleIcon}
			title="Container Size"
			value={stats.size ? bytesToHuman(stats.size) : '-'}
		/>
		<StatsCard
			icon={CloudUploadIcon}
			title="Network Receive"
			value={stats.input >= 0 ? bytesToHuman(stats.input ?? 0) : '-'}
		/>
		<StatsCard
			icon={CloudDownloadIcon}
			title="Network Transmit"
			value={stats.output >= 0 ? bytesToHuman(stats.output ?? 0) : '-'}
		/>
	</div>
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">
		Container has to be running to view statistics
	</p>
{/if}
