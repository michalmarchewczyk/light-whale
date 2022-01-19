<script lang="ts">
	import ChipIcon from '$icons/chip.svg';
	import ServerIcon from '$icons/server.svg';
	import CloudDownloadIcon from '$icons/cloud-download.svg';
	import CloudUploadIcon from '$icons/cloud-upload.svg';
	import PuzzleIcon from '$icons/puzzle.svg';

	import {Container, containers} from '$lib/stores/containers';
	import {page} from '$app/stores';
	import {onMount} from 'svelte';
	import {bytesToHuman} from '$lib/utils/bytesToHuman';

	import StatsCard from '$lib/components/containers/StatsCard.svelte';

	let container:Container;

	$: container = $containers.find(c => c.names.includes('/' + $page.params.id));

	let stats = {};

	const getStats = async () => {
		if (!container?.id || container?.state !== 'running') return;
		const res = await fetch(`/docker/container?id=${container.id}`);
		if (res.status !== 200) return;
		const data = await res.json();
		stats = data;
	};

	onMount(() => {
		getStats();
		const interval = setInterval(getStats, 1000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

{#if container?.state === 'running'}

	<div class="w-full shadow-md bg-base-100 stats grid-cols-3">
		<StatsCard icon={ChipIcon} title="CPU Usage" value={stats.cpu>=0 ? stats.cpu?.toFixed(2)+' %' : '-'}/>
		<StatsCard icon={ChipIcon} title="Active CPU Cores" value={stats.cores ?? '-'}/>
		<StatsCard icon={ServerIcon} title="Memory Usage" value={stats.memory ? bytesToHuman(stats.memory) : '-'}/>
	</div>

	<div class="w-full shadow-md bg-base-100 stats grid-cols-3 mt-8">
		<StatsCard icon={PuzzleIcon} title="Container Size" value={stats.size ? bytesToHuman(stats.size) : '-'}/>
		<StatsCard icon={CloudUploadIcon} title="Network Receive"
				   value={stats.input>=0 ? bytesToHuman(stats.input ?? 0) : '-'}/>
		<StatsCard icon={CloudDownloadIcon} title="Network Transmit"
				   value={stats.output>=0 ? bytesToHuman(stats.output ?? 0) : '-'}/>
	</div>

	<div class="card shadow-md bg-base-100 mt-8 p-4 pt-1">
		<span class="card-title p-2">Processes</span>
		<table class="table w-full table-zebra">
			<thead>
			<tr>
				{#each stats?.processes?.Titles ?? [] as title}
					<th class="bg-neutral text-neutral-content">{title}</th>
				{/each}
			</tr>
			</thead>
			<tbody>
			{#each stats?.processes?.Processes ?? [] as process}
				<tr>
					{#each process as value}
						<td>{value}</td>
					{/each}
				</tr>
			{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="w-full text-center text-2xl pt-8 opacity-80">Container has to be running to view statistics</p>
{/if}


<style lang="scss">

</style>
