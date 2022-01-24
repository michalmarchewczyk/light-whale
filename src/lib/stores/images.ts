import {writable} from 'svelte/store';
import {forceUpdateEverything} from '$lib/stores/docker';

export interface Image {
	id:string,
	created:Date,
	tags:string[],
	digests:string[],
	size:number,
}

export const images = writable<Image[]>([]);

export const fetchImages = async ():Promise<void> => {
	const res = await fetch('/docker/images');
	if(res.status !== 200){
		return;
	}
	const data = await res.json();
	images.set(data ?? []);
};

export const removeImage = async (id:string):Promise<void> => {
	await fetch('/docker/images', {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({id}),
	});
	await forceUpdateEverything();
};
