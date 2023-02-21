import type { Actions, PageServerLoad } from './$types';
import { statusController } from '$lib/server/status';
import { redirect } from '@sveltejs/kit';
import { nginxManager } from '$lib/server/docker';

export const load = (async () => {
	const { lwNetwork, lwNginxContainer } = await statusController.getCurrentStatus();
	if (lwNetwork && lwNginxContainer.running && lwNginxContainer.connected) {
		throw redirect(307, '/setup/dns');
	}
}) satisfies PageServerLoad;

export const actions = {
	default: async () => {
		await nginxManager.createLwNetwork();
		await nginxManager.createLwNginxContainer();
		await statusController.updateStatus();
	}
} satisfies Actions;
