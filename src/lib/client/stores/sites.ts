import {writable} from 'svelte/store';
import {forceUpdateEverything} from '$lib/client/stores/index';

export interface Site {
	id:string,
	containerId:string,
	domain:string,
	paused:boolean,
	created:Date,
}

export const sites = writable<Site[]>([]);


export const fetchSites = async ():Promise<void> => {
	const res = await fetch('/api/network/sites');
	if(res.status !== 200){
		return;
	}
	const data = await res.json();
	sites.set(data ?? []);
};

export const unpauseSite = async (id:string):Promise<void> => {
	await fetch('/api/network/sites', {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id, action: 'unpause'}),
	});
	await forceUpdateEverything();
};

export const pauseSite = async (id:string):Promise<void> => {
	await fetch('/api/network/sites', {
		method: 'PUT',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id, action: 'pause'}),
	});
	await forceUpdateEverything();
};

export const removeSite = async (id:string):Promise<void> => {
	await fetch('/api/network/sites', {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id}),
	});
	await forceUpdateEverything();
};

export const addSite = async (containerId:string, domain:string, port:number):Promise<void> => {
	await fetch('/api/network/sites', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({containerId, domain, port}),
	});
	await forceUpdateEverything();
};
