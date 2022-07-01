import {logger, LogType} from '$lib/server/utils/Logger';
import {DOCKER_URL, LW_NETWORK_NAME} from '$lib/server/docker/config';
import type {ContainerStats} from '$lib/server/docker/ContainerStats.interface';
import type {ContainerInfo} from '$lib/server/docker/ContainerInfo.interface';
import type ContainerFilesReader from '$lib/server/docker/ContainerFilesReader';
import type {File} from '$lib/server/docker/File.interface';

export default class Container {
	constructor(public id:string, public info:ContainerInfo, private containerFilesReader:ContainerFilesReader) {}

	public async start():Promise<boolean>{
		logger.log(LogType.Info, `Starting container with id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/start`, {method: 'POST'});
		return res.status === 204;
	}

	public async stop():Promise<boolean>{
		logger.log(LogType.Info, `Stopping container with id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/stop`, {method: 'POST'});
		return res.status === 204;
	}

	public async restart():Promise<boolean>{
		logger.log(LogType.Info, `Restarting container with id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/restart`, {method: 'POST'});
		return res.status === 204;
	}

	public async remove():Promise<boolean>{
		logger.log(LogType.Info, `Removing container with id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}`, {method: 'DELETE'});
		return res.status === 204;
	}

	public async inspect():Promise<Record<string, string>>{
		logger.log(LogType.Verbose, `Inspecting container with id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/json?size=true`);
		if (res.status !== 200) {
			return {};
		}
		return await res.json().catch(() => ({}));
	}

	public async connectToLWNetwork():Promise<boolean>{
		logger.log(LogType.Info, `Connecting container with id: ${this.id} to LW network`);
		const res = await fetch(DOCKER_URL + `/networks/${LW_NETWORK_NAME}/connect`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({Container: this.id}),
		});
		return res.status === 200;
	}

	public async getStats():Promise<ContainerStats | null> {
		logger.log(LogType.Verbose, `Getting container stats, id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/stats?stream=false`);
		if (res.status !== 200) {
			return null;
		}
		return await res.json();
	}

	public async getProcesses():Promise<unknown> {
		logger.log(LogType.Verbose, `Getting container processes, id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/top?ps_args=-eo pid,user,pcpu,pmem,start,args`);
		if (res.status !== 200) {
			return {};
		}
		return await res.json();
	}

	public async getLogs():Promise<string> {
		logger.log(LogType.Verbose, `Getting container logs, id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/logs?stdout=true&tail=1000`);
		if (res.status !== 200) {
			return '';
		}
		return await res.text();
	}

	public async exec(command:string):Promise<string | null> {
		logger.log(LogType.Info, `Execute command: ${command} on container with id: ${this.id}`);
		const resCreate = await fetch(DOCKER_URL + `/containers/${this.id}/exec`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				'AttachStdin': true,
				'AttachStdout': true,
				'AttachStderr': true,
				'Tty': true,
				'Cmd': [...command.split(' ')],
			}),
		});
		if (resCreate.status !== 201) {
			return null;
		}
		const dataCreate = await resCreate.json();
		const execId = dataCreate.Id;
		const resStart = await fetch(DOCKER_URL + `/exec/${execId}/start`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				'Detach': false,
				'Tty': true,
			}),
		});
		if (resStart.status !== 200) {
			return null;
		}
		return await resStart.text();
	}

	public async getFiles(path:string):Promise<File[]> {
		return await this.containerFilesReader.getContainerFiles(this, path);
	}

	public async readFile(path:string):Promise<string> {
		return await this.containerFilesReader.readContainerFile(this, path);
	}
}
