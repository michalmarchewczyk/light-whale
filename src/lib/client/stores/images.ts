import {writable} from 'svelte/store';
import {forceUpdateEverything} from '$lib/client/stores/docker';

export interface Image {
	id:string,
	created:Date,
	tags:string[],
	digests:string[],
	size:number,
}

export const images = writable<Image[]>([]);

export const fetchImages = async ():Promise<void> => {
	const res = await fetch('/api/docker/images');
	if(res.status !== 200){
		return;
	}
	const data = await res.json();
	images.set(data ?? []);
};

export const removeImage = async (id:string):Promise<void> => {
	await fetch('/api/docker/images', {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id}),
	});
	await forceUpdateEverything();
};

export const pullImage = async (name:string, tag:string):Promise<void> => {
	await fetch('/api/docker/images', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({name, tag}),
	});
	await forceUpdateEverything();
};
