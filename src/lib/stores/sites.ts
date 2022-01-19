import {writable} from 'svelte/store';

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
