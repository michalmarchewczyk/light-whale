import type ContainerData from '$lib/server/docker/ContainerData';
import { logger, LogType } from '$lib/server/utils/Logger';
import { DOCKER_URL, LW_NETWORK_NAME } from '$lib/server/config';
import transformContainerStats from '$lib/server/docker/transformContainerStats';
import type { ContainerInspectResponse } from '$lib/server/types/docker/api';

export default class Container {
	constructor(public id: string, public data: ContainerData) {}

	public async start(): Promise<boolean> {
		logger.log(LogType.Info, `Starting container with id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/start`, { method: 'POST' });
		return res.status === 204;
	}

	public async stop(): Promise<boolean> {
		logger.log(LogType.Info, `Stopping container with id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/stop`, { method: 'POST' });
		return res.status === 204;
	}

	public async restart(): Promise<boolean> {
		logger.log(LogType.Info, `Restarting container with id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/restart`, { method: 'POST' });
		return res.status === 204;
	}

	public async remove(): Promise<boolean> {
		logger.log(LogType.Info, `Removing container with id: ${this.id}`);
		const res = await fetch(DOCKER_URL + `/containers/${this.id}`, { method: 'DELETE' });
		return res.status === 204;
	}

	public async connectToLWNetwork(): Promise<boolean> {
		logger.log(LogType.Info, `Connecting container with id: ${this.id} to LW network`);
		const res = await fetch(DOCKER_URL + `/networks/${LW_NETWORK_NAME}/connect`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ Container: this.id })
		});
		return res.status === 200;
	}

	async getLogsStream() {
		const res = await fetch(
			DOCKER_URL + `/containers/${this.id}/logs?follow=true&stdout=true&stderr=true&timestamps=true`
		);
		return res.body;
	}

	async getStatsStream() {
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/stats?stream=true`);
		const inspectData = await this.inspect();
		return res.body?.pipeThrough(transformContainerStats(inspectData));
	}

	public async inspect(): Promise<ContainerInspectResponse> {
		const res = await fetch(DOCKER_URL + `/containers/${this.id}/json?size=true`);
		if (res.status !== 200) {
			return {};
		}
		return await res.json().catch(() => ({}));
	}

	public async exec(command: string): Promise<string | null> {
		logger.log(LogType.Info, `Execute command: ${command} on container with id: ${this.id}`);
		const resCreate = await fetch(DOCKER_URL + `/containers/${this.id}/exec`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				AttachStdin: true,
				AttachStdout: true,
				AttachStderr: false,
				Tty: true,
				Cmd: [...command.split(' ')]
			})
		});
		if (resCreate.status !== 201) {
			return null;
		}
		const dataCreate = await resCreate.json();
		const execId = dataCreate.Id;
		const resStart = await fetch(DOCKER_URL + `/exec/${execId}/start`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				Detach: false,
				Tty: true
			})
		});
		if (resStart.status !== 200) {
			return null;
		}
		return await resStart.text();
	}
}
