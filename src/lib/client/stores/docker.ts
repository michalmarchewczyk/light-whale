import {get, writable} from 'svelte/store';
import {fetchContainers} from '$lib/client/stores/containers';
import {fetchImages} from '$lib/client/stores/images';
import {fetchSites} from '$lib/client/stores/sites';
import {fetchNetworkAvailable, fetchNginxAvailable, fetchNginxConfig} from '$lib/client/stores/network';

export const dockerAvailable = writable(false);
export const lastUpdate = writable<number>(0);

export const fetchDockerAvailable = async ():Promise<void> => {
	const res = await fetch('/api/docker/system/ping?skipLogger=true');
	const data = await res.text();
	if (data === 'true') {
		dockerAvailable.set(true);
	} else {
		dockerAvailable.set(false);
	}
};


export const updateEverything = async ():Promise<void> => {
	await fetchDockerAvailable();
	await fetchNetworkAvailable();
	await fetchNginxAvailable();
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
	await fetchNginxConfig();
};

export const forceUpdateEverything = async ():Promise<void> => {
	await fetchDockerAvailable();
	await fetchNetworkAvailable();
	await fetchNginxAvailable();
	await fetchContainers();
	await fetchImages();
	await fetchSites();
	await fetchNginxConfig();
};

