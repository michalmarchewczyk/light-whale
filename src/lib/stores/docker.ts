import {get, writable} from 'svelte/store';

export interface Container {
	id:string,
	names:string[],
	imageName:string,
	imageId:string,
	created:Date,
	state:string,
	status:string,
	compose:string,
}

export interface ComposeApp {
	name:string,
	containers:Container[],
	created:Date,
}

export const dockerAvailable = writable(false);
export const containers = writable<Container[]>([]);
export const composeApps = writable<ComposeApp[]>([]);
export const lastUpdate = writable<number>(0);

export const fetchDockerAvailable = async ():Promise<void> => {
	const res = await fetch('/docker/ping');
	const data = await res.text();
	if(data === 'true'){
		dockerAvailable.set(true);
	}else{
		dockerAvailable.set(false);
	}
};


export const fetchContainers = async ():Promise<void> => {
	const res = await fetch('/docker/containers');
	const data = await res.json();
	containers.set(data ?? []);
	const apps:ComposeApp[] = [];
	for(const container of data){
		if(container.compose){
			let app = apps.find(a => a.name === container.compose);
			if(!app){
				app = {
					name: container.compose,
					containers: [],
					created: new Date(0)
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
	await fetch('/docker/containers', {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id, action:'start'}),
	});
	await forceUpdateEverything();
};

export const stopContainer = async (id:string):Promise<void> => {
	await fetch('/docker/containers', {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id, action:'stop'}),
	});
	await forceUpdateEverything();
};

export const restartContainer = async (id:string):Promise<void> => {
	await fetch('/docker/containers', {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id, action:'restart'}),
	});
	await forceUpdateEverything();
};

export const removeContainer = async (id:string):Promise<void> => {
	await fetch('/docker/containers', {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id, action:'remove'}),
	});
	await forceUpdateEverything();
};



export const updateEverything = async ():Promise<void> => {
	await fetchDockerAvailable();
	const res = await fetch('/docker/events');
	const lastEvent = await res.json();
	if(!lastEvent?.time || lastEvent.time === get(lastUpdate) ){
		return;
	}
	lastUpdate.set(lastEvent.time);
	await fetchContainers();
};

export const forceUpdateEverything = async ():Promise<void> => {
	await fetchDockerAvailable();
	await fetchContainers();
};


