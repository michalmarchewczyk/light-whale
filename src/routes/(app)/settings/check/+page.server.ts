import type { Actions } from './$types';
import { statusController } from '$lib/server/status';
import { nginxManager } from '$lib/server/docker';

export const actions = {
	fix: async () => {
		const status = await statusController.getCurrentStatus();
		if (!status.lwNetwork) {
			await nginxManager.fixLwNetwork();
		}
		if (
			!status.lwNginxContainer.running ||
			!status.lwNginxContainer.connected ||
			!status.lwNginxContainer.ports ||
			!status.lwNginxContainer.restartPolicy
		) {
			await nginxManager.fixLwNginxContainer();
		}
	}
} satisfies Actions;
