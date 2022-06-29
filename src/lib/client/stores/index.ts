import {get, writable} from 'svelte/store';
import {fetchContainers} from '$lib/client/stores/containers';
import {fetchImages} from '$lib/client/stores/images';
import {fetchSites} from '$lib/client/stores/sites';
import {fetchStatus} from '$lib/client/stores/status';

export const lastUpdate = writable<number>(0);


export const updateEverything = async ():Promise<void> => {
	await fetchStatus();
	const res = await fetch('/api/docker/system/events?skipLogger=true');
	if(res.status !== 200){
		return;
	}
	const lastEvent = await res.json();
	if (!lastEvent?.time || lastEvent.time === get(lastUpdate)) {
		return;
	}
	lastUpdate.set(lastEvent.time);
	await fetchContainers();
	await fetchImages();
	await fetchSites();
};

export const forceUpdateEverything = async ():Promise<void> => {
	await fetchStatus();
	await fetchContainers();
	await fetchImages();
	await fetchSites();
};


