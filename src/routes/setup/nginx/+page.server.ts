import type { Actions, PageServerLoad } from './$types';
import { statusController } from '$lib/server/status';
import { redirect } from '@sveltejs/kit';
import { nginxManager } from '$lib/server/docker';

export const load = (async () => {
	const { lwNetwork } = await statusController.getCurrentStatus();
	if (lwNetwork) {
		throw redirect(307, '/setup/dns');
	}
}) satisfies PageServerLoad;

export const actions = {
	default: async () => {
		await nginxManager.createLwNetwork();
		await statusController.updateStatus();
	}
} satisfies Actions;
