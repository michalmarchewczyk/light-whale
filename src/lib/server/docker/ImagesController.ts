import {logger, LogType} from '$lib/server/utils/Logger';
import {DOCKER_URL} from '$lib/server/docker/config';
import type {Image} from '$lib/server/docker/Image.interface';

export default class ImagesController {
	public async getImages(): Promise<Image[]> {
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
	}

	public async getImage(id:string): Promise<Image> {
		const images = await this.getImages();
		return images.find(image => image.id === id);
	}

	public async removeImage(id:string): Promise<boolean> {
		logger.log(LogType.Info, `Remove image with id: ${id}`);
		const res = await fetch(DOCKER_URL + `/images/${id}`, {method: 'DELETE'});
		return res.status === 200;
	}

	public async pullImage(name:string, tag:string): Promise<boolean> {
		logger.log(LogType.Info, `Pull image with name: ${name} and tag: ${tag}`);
		if(!tag) {
			return false;
		}
		const res = await fetch(DOCKER_URL + `/images/create?fromImage=${name}&tag=${tag}`, {method: 'POST'});
		logger.log(LogType.Info, `Pulled image with name: ${name} and tag: ${tag}`);
		return res.status === 200;
	}

	public async getImagesNames(): Promise<string[]> {
		const images = await this.getImages();
		return images.map(image => image.tags.map(tag => tag.split(':')[0])).flat();
	}
}
