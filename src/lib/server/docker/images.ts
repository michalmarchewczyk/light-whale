import {DOCKER_URL} from '$lib/server/docker/config';
import {logger, LogType} from '$lib/server/utils/Logger';

export interface Image {
	id:string,
	created:Date,
	tags:string[],
	digests:string[],
	size:number,
}

export const getImages = async ():Promise<Image[]> => {
	logger.log(LogType.Info, 'Listing images');
	try {
		const res = await fetch(DOCKER_URL + '/images/json?all=false');
		const data = await res.json();
		return data.map((image):Image => ({
			id: image.Id ?? '',
			created: new Date(image.Created * 1000 ?? 0),
			tags: image.RepoTags ?? [],
			digests: image.RepoDigests ?? [],
			size: image.Size ?? 0,
		}));
	}catch(e){
		return [];
	}
};

export const removeImage = async (id:string):Promise<boolean> => {
	logger.log(LogType.Info, `Remove image with id: ${id}`);
	const res = await fetch(DOCKER_URL + `/images/${id}`, {method: 'DELETE'});
	return res.status === 200;
};

export const pullImage = async (name:string, tag:string):Promise<boolean> => {
	logger.log(LogType.Info, `Pull image with name: ${name} and tag: ${tag}`);
	if(!tag) {
		return false;
	}
	const res = await fetch(DOCKER_URL + `/images/create?fromImage=${name}&tag=${tag}`, {method: 'POST'});
	logger.log(LogType.Info, `Pulled image with name: ${name} and tag: ${tag}`);
	return res.status === 200;
};


export const getImagesNames = async ():Promise<string[]> => {
	const images = await getImages();
	return images.map(image => image.tags.map(tag => tag.split(':')[0])).flat();
};
