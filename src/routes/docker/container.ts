import type {RequestHandler} from '@sveltejs/kit';
import validator from 'validator';
import {getContainerProcesses, getContainerStats, inspectContainer} from '$lib/docker/containers';
import {checkSession} from '$lib/auth/sessions';

const get:RequestHandler = async ({url, headers}) => {
	if(!checkSession(headers)){
		return {
			status: 401,
		};
	}
	const id = url.searchParams.get('id') ?? '';
	if (!id) {
		return {
			status: 400
		};
	}
	if(!validator.isAlphanumeric(id)){
		return {
			status: 400,
		};
	}
	try {
		const data = await getContainerStats(id);
		const data2 = await inspectContainer(id);
		const data3 = await getContainerProcesses(id);
		if(!data || !data2 || !data3){
			return {
				status: 500,
			};
		}
		const cpu_delta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
		const system_cpu_delta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage ;
		const number_cpus = data.cpu_stats.online_cpus;
		const used_memory = data.memory_stats.usage - data.memory_stats.stats.cache;
		const input = Object.values(data.networks)[0]?.['rx_bytes'];
		const output = Object.values(data.networks)[0]?.['tx_bytes'];
		const stats = {
			cpu: (cpu_delta / system_cpu_delta) * number_cpus * 100,
			cores: number_cpus,
			memory:	used_memory,
			size: data2['SizeRootFs'],
			input,
			output,
			processes: data3
		};
		return {
			status: 200,
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(stats),
		};
	}catch(e){
		return {
			status: 500
		};
	}
};

export {
	get
};
