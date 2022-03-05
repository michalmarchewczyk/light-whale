import {DOCKER_URL, LW_NETWORK_NAME} from '$lib/server/docker/config';

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
	networks:Record<string, unknown>,
}

export const getContainers = async ():Promise<Container[]> => {
	try {
		const res = await fetch(DOCKER_URL + '/containers/json?all=true&size=true');
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
			networks: container.NetworkSettings['Networks'] ?? {},
		}));
		return containers;
	}catch(e){
		return [];
	}
};


export const startContainer = async (id:string):Promise<boolean> => {
	const res = await fetch(DOCKER_URL + `/containers/${id}/start`, {method: 'POST'});
	return res.status === 204;
};

export const stopContainer = async (id:string):Promise<boolean> => {
	const res = await fetch(DOCKER_URL + `/containers/${id}/stop`, {method: 'POST'});
	return res.status === 204;
};

export const restartContainer = async (id:string):Promise<boolean> => {
	const res = await fetch(DOCKER_URL + `/containers/${id}/restart`, {method: 'POST'});
	return res.status === 204;
};

export const removeContainer = async (id:string):Promise<boolean> => {
	const res = await fetch(DOCKER_URL + `/containers/${id}`, {method: 'DELETE'});
	return res.status === 204;
};


export const inspectContainer = async (id:string):Promise<unknown> => {
	try {
		const res = await fetch(DOCKER_URL + `/containers/${id}/json?size=true`);
		if (res.status !== 200) {
			return {};
		}
		return await res.json();
	}catch(e){
		return {};
	}
};

export const createContainer = async (imageId:string, name:string, command:string):Promise<boolean> => {
	const query = name ? '?name=' + name : '';
	const res = await fetch(`${DOCKER_URL}/containers/create${query}`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			Image: imageId,
			Cmd: command ? command.split(' ') : null,
		}),
	});
	return res.status === 201;
};


interface ContainerStats {
	cpu_stats:{
		cpu_usage:{
			total_usage:number,
			system_cpu_usage:number;
		},
		system_cpu_usage:number,
		online_cpus:number,
	},
	precpu_stats:{
		cpu_usage:{
			total_usage:number,
			system_cpu_usage:number;
		},
		system_cpu_usage:number,
		online_cpus:number,
	},
	memory_stats:{
		usage:number,
		stats:{
			cache:number,
		}
	},
	networks:unknown
}

export const getContainerStats = async (id:string):Promise<ContainerStats | null> => {
	const res = await fetch(DOCKER_URL + `/containers/${id}/stats?stream=false`);
	if (res.status !== 200) {
		return null;
	}
	return await res.json();
};

export const getContainerProcesses = async (id:string):Promise<unknown> => {
	const res = await fetch(DOCKER_URL + `/containers/${id}/top?ps_args=-eo pid,user,pcpu,pmem,start,args`);
	if (res.status !== 200) {
		return {};
	}
	return await res.json();
};


export const getContainerLogs = async (id:string):Promise<string> => {
	const res = await fetch(DOCKER_URL + `/containers/${id}/logs?stdout=true&tail=1000`);
	if (res.status !== 200) {
		return '';
	}
	return await res.text();
};

export const connectToLWNetwork = async (id:string):Promise<boolean> => {
	const res = await fetch(DOCKER_URL + `/networks/${LW_NETWORK_NAME}/connect`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({Container: id}),
	});
	return res.status === 200;
};
