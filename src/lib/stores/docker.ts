import {get, writable} from 'svelte/store';
import {fetchContainers} from '$lib/stores/containers';

export const dockerAvailable = writable(false);
export const lastUpdate = writable<number>(0);

export const fetchDockerAvailable = async ():Promise<void> => {
	const res = await fetch('/docker/ping');
	const data = await res.text();
	if (data === 'true') {
		dockerAvailable.set(true);
	} else {
		dockerAvailable.set(false);
	}
};


export const updateEverything = async ():Promise<void> => {
	await fetchDockerAvailable();
	const res = await fetch('/docker/events');
	const lastEvent = await res.json();
	if (!lastEvent?.time || lastEvent.time === get(lastUpdate)) {
		return;
	}
	lastUpdate.set(lastEvent.time);
	await fetchContainers();
};

export const forceUpdateEverything = async ():Promise<void> => {
	await fetchDockerAvailable();
	await fetchContainers();
};


