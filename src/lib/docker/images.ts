import {DOCKER_URL} from '$lib/docker/config';

export interface Image {
	id:string,
	created:Date,
	tags:string[],
	digests:string[],
	size:number,
}

export const getImages = async ():Promise<Image[]> => {
	const res = await fetch(DOCKER_URL + '/images/json?all=false');
	const data = await res.json();
	return data.map((image):Image => ({
		id: image.Id ?? '',
		created: new Date(image.Created * 1000 ?? 0),
		tags: image.RepoTags ?? [],
		digests: image.RepoDigests ?? [],
		size: image.Size ?? 0,
	}));
};

export const removeImage = async (id:string):Promise<boolean> => {
	const res = await fetch(DOCKER_URL + `/images/${id}`, {method: 'DELETE'});
	return res.status === 200;
};
