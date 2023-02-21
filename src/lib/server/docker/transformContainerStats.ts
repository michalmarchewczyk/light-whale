import type { ContainerInspectResponse } from '$lib/server/types/docker/api';

const transformContainerStats = (inspectData: ContainerInspectResponse) => {
	return new TransformStream({
		transform: (chunk, controller) => {
			try {
				const data = JSON.parse(new TextDecoder().decode(chunk));
				const cpuDelta =
					data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
				const systemCpuDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
				const numberOfCpus = data.cpu_stats.online_cpus;
				const usedMemory = data.memory_stats.usage - data.memory_stats.stats.cache;
				const input = Object.values(data.networks).reduce(
					(p, c) => (p as number) + (c as { rx_bytes: number })['rx_bytes'] ?? 0,
					0
				);
				const output = Object.values(data.networks).reduce(
					(p, c) => (p as number) + (c as { tx_bytes: number })['tx_bytes'] ?? 0,
					0
				);
				const stats = {
					cpu: (cpuDelta / systemCpuDelta) * numberOfCpus * 100,
					cores: numberOfCpus,
					memory: usedMemory,
					size: inspectData['SizeRootFs'],
					input,
					output
				};
				controller.enqueue(JSON.stringify(stats));
			} catch (e) {
				// ignore
			}
		}
	});
};

export default transformContainerStats;
