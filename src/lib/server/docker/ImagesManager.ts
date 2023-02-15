import { logger } from '$lib/server/utils/Logger';
import Image from '$lib/server/docker/Image';
import { DOCKER_URL } from '$lib/server/config';
import type { ImageSummary } from '$lib/server/types/docker/api';
import type ImageData from '$lib/server/docker/ImageData';

export default class ImagesManager {
	private images: Image[] = [];

	constructor() {
		logger.logVerbose('ImagesManager initialized');
	}

	public async getImages(): Promise<Image[]> {
		try {
			logger.logVerbose('Listing images');
			const res = await fetch(`${DOCKER_URL}/images/json?all=true&digests=true`);
			const data: ImageSummary[] = await res.json();
			this.images = data.map((summary) => this.createImageFromSummary(summary));
			return this.images;
		} catch (e) {
			return [];
		}
	}

	public async getImagesData(): Promise<ImageData[]> {
		const images = await this.getImages();
		return images.map((i) => i.data);
	}

	private createImageFromSummary(summary: ImageSummary): Image {
		const data: ImageData = {
			id: summary.Id ?? '',
			created: new Date((summary.Created ?? 0) * 1000),
			tags: summary.RepoTags ?? [],
			digests: summary.RepoDigests ?? [],
			size: summary.Size ?? 0
		};
		return new Image(data.id, data);
	}

	public async getImage(id: string): Promise<Image | null> {
		if (!id.startsWith('sha256:')) {
			id = `sha256:${id}`;
		}
		if (!this.images.find((i) => i.id.startsWith(id))) {
			await this.getImages();
		}
		return this.images.find((i) => i.id.startsWith(id)) ?? null;
	}
}
