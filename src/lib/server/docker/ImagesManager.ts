import { logger } from '$lib/server/utils/Logger';
import Image from '$lib/server/docker/Image';
import { DOCKER_URL } from '$lib/server/config';
import type { ImageSummary } from '$lib/server/types/docker/api';
import type ImageData from '$lib/server/docker/ImageData';
import type ProcessesManager from '$lib/server/processes/ProcessesManager';

export default class ImagesManager {
	private images: Image[] = [];

	constructor(private processesManager: ProcessesManager) {
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

	public async pullImage(image: string, tag: string, wait = false): Promise<boolean> {
		logger.logInfo(`Pulling image ${image}:${tag}`);
		const process = await this.processesManager.createNewProcess(`Pulling image ${image}:${tag}`);
		const layers: Record<string, { current: number; total: number }> = {};
		const writeStream = new WritableStream({
			write: async (chunk) => {
				try {
					const data = JSON.parse(new TextDecoder().decode(chunk));
					if (!layers[data.id]) {
						layers[data.id] = { current: 0, total: 0 };
					}
					if (data.progressDetail.total && data.status === 'Downloading') {
						layers[data.id].total = data.progressDetail.total * 2;
					}
					if (data.progressDetail.current && data.status === 'Downloading') {
						layers[data.id].current = data.progressDetail.current;
					}
					if (data.progressDetail.current && data.status === 'Extracting') {
						layers[data.id].current = data.progressDetail.total + data.progressDetail.current;
					}
					const total = Object.values(layers).reduce((acc, cur) => acc + cur.total, 0);
					const current = Object.values(layers).reduce((acc, cur) => acc + cur.current, 0);
					await this.processesManager.updateProcess(
						process.id,
						'running',
						`(layer:${data.id}) ${data.status}: ${data.progress ?? '-'} \n`,
						(current / total) * 100
					);
				} catch (err) {
					// ignore
				}
			},
			close: async () => {
				await this.processesManager.updateProcess(process.id, 'done', 'Done');
			}
		});
		try {
			const res = await fetch(`${DOCKER_URL}/images/create?fromImage=${image}&tag=${tag}`, {
				method: 'POST'
			});
			if (!res.body) {
				return false;
			}
			if (wait) {
				await res.text();
				await this.processesManager.updateProcess(process.id, 'done', 'Done');
				logger.logInfo(`Pulled image ${image}:${tag}`);
				return true;
			}
			res.body.pipeTo(writeStream).then(() => {
				logger.logInfo(`Pulled image ${image}:${tag}`);
			});
			return true;
		} catch (err) {
			return false;
		}
	}
}
