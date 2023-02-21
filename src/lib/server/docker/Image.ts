import type ImageData from '$lib/server/docker/ImageData';
import { logger } from '$lib/server/utils/Logger';
import { DOCKER_URL } from '$lib/server/config';

export default class Image {
	constructor(public id: string, public data: ImageData) {}

	async remove() {
		logger.logInfo(`Remove image with id: ${this.id}`);
		const res = await fetch(`${DOCKER_URL}/images/${this.id}`, {
			method: 'DELETE'
		});
		return res.status === 200;
	}
}
