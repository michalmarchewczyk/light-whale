import type DockerController from '$lib/server/docker/DockerController';
import type Status from '$lib/server/status/Status';

export default class StatusController {
	private controllers: ReadableStreamDefaultController[] = [];
	private status: Status | null = null;

	constructor(private dockerController: DockerController) {
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

	private async updateStatus() {
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
		this.status = {
			dockerRunning,
			dockerPing,
			lwNetwork: false,
			lwNginxContainer: {
				running: false,
				connected: false,
				ports: false,
				restartPolicy: false
			}
		};
		this.controllers.forEach((c) => c.enqueue(JSON.stringify(this.status) + '\n'));
	}
}
