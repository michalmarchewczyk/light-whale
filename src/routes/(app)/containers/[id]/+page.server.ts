import type { Actions } from './$types';
import { containersManager } from '$lib/server/docker';
import { fail } from '@sveltejs/kit';

export const actions = {
	start: async ({ params }) => {
		const container = await containersManager.findContainer(params.id);
		if (!container) {
			throw fail(404, { message: 'Container not found' });
		}
		await container.start();
	},
	stop: async ({ params }) => {
		const container = await containersManager.findContainer(params.id);
		if (!container) {
			throw fail(404, { message: 'Container not found' });
		}
		await container.stop();
	},
	restart: async ({ params }) => {
		const container = await containersManager.findContainer(params.id);
		if (!container) {
			throw fail(404, { message: 'Container not found' });
		}
		await container.restart();
	},
	remove: async ({ params }) => {
		const container = await containersManager.findContainer(params.id);
		if (!container) {
			throw fail(404, { message: 'Container not found' });
		}
		await container.remove();
	}
} satisfies Actions;
