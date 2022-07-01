import {logger, LogType} from '$lib/server/utils/Logger';
import {DOCKER_URL} from '$lib/server/docker/config';
import Container from '$lib/server/docker/Container';
import type {ContainerSummary} from '$lib/server/typings/docker/api';
import type {ContainerInfo} from '$lib/server/docker/ContainerInfo.interface';
import type ContainerFilesReader from '$lib/server/docker/ContainerFilesReader';

export default class ContainersController {
	private containers:Container[] = [];

	constructor(private containerFilesReader:ContainerFilesReader) {}

	public async getContainers():Promise<ContainerInfo[]> {
		try {
			logger.log(LogType.Info, 'Listing containers');
			const res = await fetch(DOCKER_URL + '/containers/json?all=true&size=true');
			const data:ContainerSummary[] = await res.json();
			this.containers = data.map((data):Container => this.createContainerFromData(data));
			return this.containers.map(container => container.info);
		}catch(e){
			return [];
		}
	}

	private createContainerFromData(data:ContainerSummary):Container {
		const info:ContainerInfo = {
			id: data.Id ?? '',
			names: data.Names ?? [],
			imageName: data.Image ?? '',
			imageId: data.ImageID ?? '',
			command: data.Command ?? '',
			created: new Date(data.Created * 1000 ?? 0),
			state: data.State ?? '',
			status: data.Status ?? '-',
			compose: data.Labels['com.docker.compose.project'] ?? null,
			networks: data.NetworkSettings['Networks'] ?? {},
		};
		return new Container(info.id, info, this.containerFilesReader);
	}

	public async getContainerAndComposeNames():Promise<string[]> {
		await this.getContainers();
		return this.containers.map(c => [...c.info.names.map(n => n.slice(1)), c.info.compose]).flat();
	}

	public async getContainer(id:string):Promise<Container | null> {
		if(!this.containers.find(c => c.id === id)){
			await this.getContainers();
		}
		return this.containers.find(c => c.id === id) ?? null;
	}

	public async getContainerByName(name:string):Promise<Container | null> {
		name = '/' + name;
		if(!this.containers.find(c => c.info.names.includes(name))){
			await this.getContainers();
		}
		return this.containers.find(c => c.info.names.includes(name)) ?? null;
	}

	public async createContainer(imageId:string, name:string, command:string):Promise<boolean> {
		logger.log(LogType.Info, `Create container with imageId: ${imageId} and name ${name}`);
		const query = name ? '?name=' + name : '';
		const res = await fetch(`${DOCKER_URL}/containers/create${query}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				Image: imageId,
				Cmd: command ? command.split(' ') : null,
			}),
		});
		return res.status === 201;
	}
}
