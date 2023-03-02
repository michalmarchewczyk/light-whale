import { DOCKER_URL, LW_NETWORK_NAME, LW_NGINX_CONTAINER_NAME } from '$lib/server/config';
import { logger } from '$lib/server/utils/Logger';
import type ContainersManager from '$lib/server/docker/ContainersManager';
import type Status from '$lib/server/status/Status';
import type FilesManager from '$lib/server/utils/FilesManager';
import defaultConfig from '$lib/server/templates/default.conf?raw';
import page404 from '$lib/server/templates/404.html?raw';
import page502 from '$lib/server/templates/502.html?raw';
import type ImagesManager from '$lib/server/docker/ImagesManager';

export default class NginxManager {
	constructor(
		private containersManager: ContainersManager,
		private imagesManager: ImagesManager,
		private filesManager: FilesManager
	) {
		logger.logVerbose('NginxManager initialized');
	}

	public async checkLwNetwork() {
		try {
			const res = await fetch(`${DOCKER_URL}/networks/${LW_NETWORK_NAME}`);
			return res.status === 200;
		} catch (e) {
			return false;
		}
	}

	public async checkLwNginxContainer(): Promise<Status['lwNginxContainer']> {
		const container = await this.containersManager.getContainerByName(LW_NGINX_CONTAINER_NAME);
		if (!container) {
			return {
				running: false,
				connected: false,
				ports: false,
				restartPolicy: false
			};
		}
		const containerInspect = await container.inspect();
		return {
			running: containerInspect.State?.Running || false,
			connected: Object.keys(containerInspect.NetworkSettings?.Networks || {}).includes(
				LW_NETWORK_NAME
			),
			ports: containerInspect.HostConfig?.PortBindings?.['80/tcp']?.[0]?.HostPort === '80',
			restartPolicy: containerInspect.HostConfig?.RestartPolicy?.Name === 'always'
		};
	}

	public async createLwNetwork() {
		logger.logInfo('Creating LW network');
		const res = await fetch(`${DOCKER_URL}/networks/create`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				Name: LW_NETWORK_NAME,
				CheckDuplicate: true,
				Attachable: true
			})
		});
		if (res.status !== 201 && res.status !== 409) {
			logger.logError(`Failed to create LW network: ${res.status}`);
		}
		logger.logInfo('Created LW network');
		return true;
	}

	public async createLwNginxContainer() {
		logger.logInfo('Creating LW container');
		await this.filesManager.writeFile('sites/default.conf', defaultConfig, true);
		await this.filesManager.writeFile('sites/404.html', page404, true);
		await this.filesManager.writeFile('sites/502.html', page502, true);
		const sitesPath = await this.filesManager.getAbsPath('sites/');
		await this.imagesManager.pullImage('mmarchewczyk/light-whale-nginx', 'latest', true);
		const res = await fetch(DOCKER_URL + `/containers/create?name=${LW_NGINX_CONTAINER_NAME}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				Image: 'mmarchewczyk/light-whale-nginx:latest',
				HostConfig: {
					Binds: [`${sitesPath}:/etc/nginx/conf.d`],
					PortBindings: {
						'80/tcp': [{ HostPort: '80' }]
					},
					RestartPolicy: {
						Name: 'always'
					}
				}
			})
		});
		if (res.status !== 201) {
			logger.logError('Failed to create LW container');
			return false;
		}
		logger.logInfo('Starting LW container');
		const container = await this.containersManager.getContainerByName(LW_NGINX_CONTAINER_NAME);
		if (!container) {
			logger.logError('Failed to start LW container');
			return false;
		}
		const started = await container.start();
		if (!started) {
			logger.logError('Failed to start LW container');
			return false;
		}
		logger.logInfo('Connecting LW container to LW network');
		const connected = await container.connectToLWNetwork();
		if (!connected) {
			logger.logError('Failed to connect LW container to LW network');
			return false;
		}
		return true;
	}

	public async reload(): Promise<boolean> {
		logger.logInfo('Reloading LW container');
		const container = await this.containersManager.getContainerByName(LW_NGINX_CONTAINER_NAME);
		if (!container) {
			return false;
		}
		await container.exec('nginx -s reload');
		return true;
	}

	public async scanContainerPorts(containerId: string): Promise<string[]> {
		const container = await this.containersManager.getContainerByName(LW_NGINX_CONTAINER_NAME);
		if (!container) {
			return [];
		}
		const res = await container.exec(
			`nmap -sT --top-ports 5000 -v0 -oN /dev/stdout ${containerId.slice(0, 12)}`
		);
		return (
			res
				?.split('\n')
				.filter((l) => /^\d+\/tcp/.test(l))
				.map((l) => `${l.split('/')[0]} (${l.split('open')[1].trim()})`) ?? []
		);
	}
}
