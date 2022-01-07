import {dockerUrl} from '$lib/docker/config';

interface Container {
	id:string,
	names:string[],
	imageName:string,
	imageId:string,
	command:string,
	created:Date,
	state:string,
	status:string,
	compose:string | null,
}

export const getContainers = async ():Promise<Container[]> => {
	const res = await fetch(dockerUrl + '/containers/json?all=true&size=true');
	const data = await res.json();
	const containers:Container[] = data.map((container):Container => ({
		id: container.Id ?? '',
		names: container.Names ?? [],
		imageName: container.Image ?? '',
		imageId: container.ImageID ?? '',
		command: container.Command ?? '',
		created: new Date(container.Created * 1000 ?? 0),
		state: container.State ?? '',
		status: container.Status ?? 4,
		compose: container.Labels['com.docker.compose.project'] ?? null,
	}));
	return containers;
};


export const startContainer = async (id:string):Promise<boolean> => {
	const res = await fetch(dockerUrl + `/containers/${id}/start`, {method: 'POST'});
	return res.status === 204;
};

export const stopContainer = async (id:string):Promise<boolean> => {
	const res = await fetch(dockerUrl + `/containers/${id}/stop`, {method: 'POST'});
	return res.status === 204;
};

export const restartContainer = async (id:string):Promise<boolean> => {
	const res = await fetch(dockerUrl + `/containers/${id}/restart`, {method: 'POST'});
	return res.status === 204;
};

export const removeContainer = async (id:string):Promise<boolean> => {
	const res = await fetch(dockerUrl + `/containers/${id}`, {method: 'DELETE'});
	return res.status === 204;
};


export const inspectContainer = async (id:string):Promise<unknown> => {
	const res = await fetch(dockerUrl + `/containers/${id}/json?size=true`);
	if(res.status !== 200){
		return {};
	}
	const data = await res.json();
	return data;
};

interface ContainerStats {
	cpu_stats: {
		cpu_usage: {
			total_usage: number,
			system_cpu_usage: number;
		},
		system_cpu_usage: number,
		online_cpus: number,
	},
	precpu_stats: {
		cpu_usage: {
			total_usage: number,
			system_cpu_usage: number;
		},
		system_cpu_usage: number,
		online_cpus: number,
	},
	memory_stats: {
		usage: number,
		stats: {
			cache: number,
		}
	},
	networks: unknown
}

export const getContainerStats = async (id:string):Promise<ContainerStats|null> => {
	const res = await fetch(dockerUrl + `/containers/${id}/stats?stream=false`);
	if(res.status !== 200){
		return null;
	}
	const data = await res.json();
	return data;
};

export const getContainerProcesses = async (id:string):Promise<unknown> => {
	const res = await fetch(dockerUrl + `/containers/${id}/top?ps_args=-eo pid,user,pcpu,pmem,start,args`);
	if(res.status !== 200){
		return {};
	}
	const data = await res.json();
	return data;
};
