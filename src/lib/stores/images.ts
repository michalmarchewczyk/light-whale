import {writable} from 'svelte/store';

export interface Image {
	id:string,
	created: Date,
	tags:string[],
	digests:string[],
	size:number,
}

export const images = writable<Image[]>([]);

export const fetchImages = async ():Promise<void> => {
	const res = await fetch('/docker/images');
	const data = await res.json();
	images.set(data ?? []);
};
