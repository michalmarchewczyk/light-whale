import {get, writable} from 'svelte/store';

export interface Container {
	id:string,
	names:string[],
	imageName:string,
	imageId:string,
	created:Date,
	state:string,
	status:string,
}

export const dockerAvailable = writable(false);
export const containers = writable<Container[]>([]);
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
};


export const updateEverything = async ():Promise<void> => {
	const res = await fetch('/docker/events');
	const lastEvent = await res.json();
	if(!lastEvent.time || lastEvent.time === get(lastUpdate) ){
		return;
	}
	lastUpdate.set(lastEvent.time);
	await fetchDockerAvailable();
	await fetchContainers();
};

export const forceUpdateEverything = async ():Promise<void> => {
	await fetchDockerAvailable();
	await fetchContainers();
};


