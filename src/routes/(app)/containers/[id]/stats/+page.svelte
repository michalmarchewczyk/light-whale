<script lang="ts">
	import type ContainerData from '$lib/server/docker/ContainerData';
	import StatsCard from '$lib/client/components/containers/StatsCard.svelte';

	import ChipIcon from '$icons/cpu-chip.svg';
	import CircleStackIcon from '$icons/circle-stack.svg';
	import CloudDownloadIcon from '$icons/cloud-arrow-down.svg';
	import CloudUploadIcon from '$icons/cloud-arrow-up.svg';
	import PuzzleIcon from '$icons/puzzle-piece.svg';

	import { bytesToHuman } from '$lib/client/utils/bytesToHuman';
	import { onMount } from 'svelte';

	export let data: { container: ContainerData };

	let stats = {};

	let connected = false;
	const abortController = new AbortController();

	onMount(() => {
		const interval = setInterval(fetchStats, 200);
		return () => {
			clearInterval(interval);
			abortController.abort();
		};
	});

	const fetchStats = () => {
		if (connected || data?.container?.state !== 'running') {
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
				stats = JSON.parse(chunkStr);
			},
			close: () => {
				connected = false;
			}
		});
		fetch(`/api/containers/${data?.container?.id}/stats`, { signal: abortController.signal })
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

{#if data.container?.state === 'running'}
	<div class="w-full shadow-md bg-base-100 stats grid-cols-3">
		<StatsCard
			icon={ChipIcon}
			title="CPU Usage"
			value={stats.cpu && stats.cpu >= 0 ? stats.cpu?.toFixed(2) + ' %' : '-'}
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
	<!--	<div class="card shadow-md bg-base-100 mt-8 p-4 pt-1">-->
	<!--		<span class="card-title p-2">Processes</span>-->
	<!--		<table class="table w-full table-zebra">-->
	<!--			<thead>-->
	<!--				<tr>-->
	<!--					{#each stats?.processes?.Titles ?? [] as title}-->
	<!--						<th class="bg-neutral text-neutral-content">{title}</th>-->
	<!--					{/each}-->
	<!--				</tr>-->
	<!--			</thead>-->
	<!--			<tbody>-->
	<!--				{#each stats?.processes?.Processes ?? [] as process}-->
	<!--					<tr>-->
	<!--						{#each process as value}-->
	<!--							<td>{value}</td>-->
	<!--						{/each}-->
	<!--					</tr>-->
	<!--				{/each}-->
	<!--			</tbody>-->
	<!--		</table>-->
	<!--	</div>-->
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">
		Container has to be running to view statistics
	</p>
{/if}
