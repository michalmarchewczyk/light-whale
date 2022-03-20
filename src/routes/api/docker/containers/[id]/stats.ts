import type {RequestHandler} from '@sveltejs/kit';
import validator from 'validator';
import {getContainerProcesses, getContainerStats, inspectContainer} from '$lib/server/docker/containers';
import {checkSession} from '$lib/server/auth/sessions';

const get:RequestHandler = async ({params, request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const id =  params.id;
	if (!id) {
		return {
			status: 400,
		};
	}
	if (!validator.isAlphanumeric(id)) {
		return {
			status: 400,
		};
	}
	try {
		const data = await getContainerStats(id);
		const data2 = await inspectContainer(id);
		const data3 = await getContainerProcesses(id);
		if (!data || !data2 || !data3) {
			return {
				status: 500,
			};
		}
		const cpuDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
		const systemCpuDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
		const numberOfCpus = data.cpu_stats.online_cpus;
		const usedMemory = data.memory_stats.usage - data.memory_stats.stats.cache;
		const input = Object.values(data.networks).reduce((p,c) => p + c['rx_bytes'] ?? 0, 0);
		const output = Object.values(data.networks).reduce((p,c) => p + c['tx_bytes'] ?? 0, 0);
		const stats = {
			cpu: (cpuDelta / systemCpuDelta) * numberOfCpus * 100,
			cores: numberOfCpus,
			memory: usedMemory,
			size: data2['SizeRootFs'],
			processes: data3,
			input,
			output,
		};
		return {
			status: 200,
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(stats),
		};
	} catch (e) {
		return {
			status: 500,
		};
	}
};

export {
	get,
};
