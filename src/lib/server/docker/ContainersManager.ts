import type ContainerData from '$lib/server/docker/ContainerData';
import Container from '$lib/server/docker/Container';
import { logger } from '$lib/server/utils/Logger';
import { DOCKER_URL } from '$lib/server/config';
import type { ContainerSummary } from '$lib/server/types/docker/api';

export default class ContainersManager {
	private containers: Container[] = [];

	constructor() {
		logger.logVerbose('ContainersManager initialized');
	}

	public async getContainers(): Promise<Container[]> {
		try {
			logger.logVerbose('Listing containers');
			const res = await fetch(`${DOCKER_URL}/containers/json?all=true`);
			const data: ContainerSummary[] = await res.json();
			this.containers = data.map((summary) => this.createContainerFromSummary(summary));
			return this.containers;
		} catch (e) {
			return [];
		}
	}

	public async getContainersData(): Promise<ContainerData[]> {
		const containers = await this.getContainers();
		return containers.map((c) => c.data);
	}

	private createContainerFromSummary(summary: ContainerSummary): Container {
		const data: ContainerData = {
			id: summary.Id ?? '',
			name: summary.Names?.[0] ?? '',
			imageName: summary.Image ?? '',
			imageId: summary.ImageID ?? '',
			command: summary.Command ?? '',
			created: new Date((summary.Created ?? 0) * 1000),
			state: summary.State ?? '',
			status: summary.Status ?? '-',
			compose: summary.Labels?.['com.docker.compose.project'] ?? null,
			networks: summary.NetworkSettings?.Networks ?? {}
		};
		return new Container(data.id, data);
	}

	public async getContainer(id: string): Promise<Container | null> {
		if (!this.containers.find((c) => c.id === id)) {
			await this.getContainers();
		}
		return this.containers.find((c) => c.id === id) ?? null;
	}

	public async getContainerByName(name: string): Promise<Container | null> {
		name = name.startsWith('/') ? name : '/' + name;
		if (!this.containers.find((c) => c.data.name === name)) {
			await this.getContainers();
		}
		return this.containers.find((c) => c.data.name === name) ?? null;
	}

	public async findContainer(idOrName: string) {
		const container = await this.getContainer(idOrName);
		if (container) {
			return container;
		}
		idOrName = idOrName.startsWith('/') ? idOrName : '/' + idOrName;
		return await this.getContainerByName(idOrName);
	}

	public async createContainer(imageId: string, name: string, command: string): Promise<boolean> {
		logger.logInfo(`Creating container with image id: ${imageId} and name: ${name}`);
		const query = name ? `name=${name}` : '';
		const res = await fetch(`${DOCKER_URL}/containers/create?${query}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ Image: imageId, Cmd: command ? command.split(' ') : null })
		});
		return res.status === 201;
	}

	public async getContainersByImageId(imageId: string): Promise<Container[]> {
		const containers = await this.getContainers();
		return containers.filter((c) => c.data.imageId === imageId);
	}
}
