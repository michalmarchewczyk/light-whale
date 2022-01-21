import {writable} from 'svelte/store';
import {forceUpdateEverything} from '$lib/stores/docker';

export interface Site {
	id:string,
	containerId:string,
	domain:string,
	paused:boolean,
	created:Date,
}

export const sites = writable<Site[]>([]);


export const fetchSites = async ():Promise<void> => {
	const res = await fetch('/network/sites');
	const data = await res.json();
	sites.set(data ?? []);
};

export const unpauseSite = async (id:string):Promise<void> => {
	await fetch('/network/sites', {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id, action: 'unpause'}),
	});
	await forceUpdateEverything();
};

export const pauseSite = async (id:string):Promise<void> => {
	await fetch('/network/sites', {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id, action: 'pause'}),
	});
	await forceUpdateEverything();
};
