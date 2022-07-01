import {LW_NETWORK_NAME} from '$lib/server/docker/config';
import {NGINX_CONTAINER_NAME} from '$lib/server/setup/config';
import type {NginxStatus} from '$lib/server/network/NginxStatus.interface';
import {containersController} from '$lib/server/docker';

export default class NginxChecker {
	private container;

	public async check():Promise<NginxStatus> {
		await this.getContainerInfo();
		return {
			running: await this.checkRunning(),
			connected: await this.checkConnected(),
			ports: await this.checkPorts(),
			restartPolicy: await this.checkRestartPolicy(),
		};
	}

	private async getContainerInfo():Promise<void> {
		const container = await containersController.getContainerByName(NGINX_CONTAINER_NAME);
		this.container = await container?.inspect();
	}

	private async checkRunning():Promise<boolean> {
		return this.container?.['State']?.['Status'] === 'running';
	}

	private async checkConnected():Promise<boolean> {
		return Object.keys(this.container?.['NetworkSettings']?.['Networks'] ?? []).includes(LW_NETWORK_NAME);
	}

	private async checkPorts():Promise<boolean> {
		return this.container?.['HostConfig']?.['PortBindings']?.['80/tcp']?.[0]?.['HostPort'] === '80';
	}

	private async checkRestartPolicy():Promise<boolean> {
		return this.container?.['HostConfig']?.['RestartPolicy']?.['Name'] === 'always';
	}
}
