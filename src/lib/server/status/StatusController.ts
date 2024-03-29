import type DockerController from '$lib/server/docker/DockerController';
import type Status from '$lib/server/status/Status';
import type NginxManager from '$lib/server/docker/NginxManager';
import { logger } from '$lib/server/utils/Logger';

export default class StatusController {
	private controllers: ReadableStreamDefaultController[] = [];
	private status: Status = {
		dockerRunning: false,
		dockerPing: false,
		lwNetwork: false,
		lwNginxContainer: {
			running: false,
			connected: false,
			ports: false,
			restartPolicy: false
		}
	};

	constructor(private dockerController: DockerController, private nginxManager: NginxManager) {
		logger.logVerbose('StatusController initialized');
		this.updateStatus();
		setInterval(() => this.updateStatus(), 500);
	}

	getReadableStream() {
		let savedController: ReadableStreamDefaultController;
		return new ReadableStream({
			start: (controller) => {
				savedController = controller;
				this.controllers.push(controller);
			},
			cancel: () => {
				this.controllers = this.controllers.filter((c) => c !== savedController);
			}
		});
	}

	getCurrentStatus() {
		return this.status;
	}

	async updateStatus() {
		const dockerPing = await this.dockerController.ping();
		let dockerRunning = dockerPing;
		if (!dockerRunning) {
			try {
				const dockerVersion = await this.dockerController.checkDockerVersion();
				dockerRunning = !!dockerVersion;
			} catch (e) {
				dockerRunning = false;
			}
		}
		const lwNetwork = await this.nginxManager.checkLwNetwork();
		const lwNginxContainer = await this.nginxManager.checkLwNginxContainer();
		this.status = {
			dockerRunning,
			dockerPing,
			lwNetwork,
			lwNginxContainer
		};
		this.controllers.forEach((c) => c.enqueue(JSON.stringify(this.status) + '\n'));
	}
}
