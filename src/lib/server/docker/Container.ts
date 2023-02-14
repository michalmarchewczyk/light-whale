import type ContainerData from '$lib/server/docker/ContainerData';
import { logger, LogType } from '$lib/server/utils/Logger';
import { DOCKER_URL, LW_NETWORK_NAME } from '$lib/server/config';

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
}
