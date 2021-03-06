import {writable} from 'svelte/store';
import {forceUpdateEverything} from '$lib/client/stores/index';

export interface Container {
	id:string,
	names:string[],
	name:string,
	imageName:string,
	imageId:string,
	created:Date,
	state:string,
	status:string,
	compose:string,
	networks:Record<string, unknown>,
}

export interface ComposeApp {
	name:string,
	containers:Container[],
	created:Date,
}

export const containers = writable<Container[]>([]);
export const composeApps = writable<ComposeApp[]>([]);


export const fetchContainers = async ():Promise<void> => {
	const res = await fetch('/api/docker/containers');
	if(res.status !== 200){
		return;
	}
	const data = await res.json();
	data?.forEach(c => c.name = c?.names[0]?.substring(1) ?? '-');
	containers.set(data ?? []);
	const apps:ComposeApp[] = [];
	for (const container of data) {
		if (container.compose) {
			let app = apps.find(a => a.name === container.compose);
			if (!app) {
				app = {
					name: container.compose,
					containers: [],
					created: new Date(0),
				};
				apps.push(app);
			}
			app.containers.push(container);
			app.created = new Date(container.created) > app.created ? new Date(container.created) : app.created;
		}
	}
	composeApps.set(apps);
};

export const startContainer = async (id:string):Promise<void> => {
	await fetch(`/api/docker/containers/${id}`, {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({action: 'start'}),
	});
	await forceUpdateEverything();
};

export const stopContainer = async (id:string):Promise<void> => {
	await fetch(`/api/docker/containers/${id}`, {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({action: 'stop'}),
	});
	await forceUpdateEverything();
};

export const restartContainer = async (id:string):Promise<void> => {
	await fetch(`/api/docker/containers/${id}`, {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({action: 'restart'}),
	});
	await forceUpdateEverything();
};

export const removeContainer = async (id:string):Promise<void> => {
	await fetch(`/api/docker/containers/${id}`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
	});
	await forceUpdateEverything();
};


export const createContainer = async (imageId:string, name:string, command:string):Promise<void> => {
	await fetch('/api/docker/containers', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({imageId, name, command}),
	});
	await forceUpdateEverything();
};
