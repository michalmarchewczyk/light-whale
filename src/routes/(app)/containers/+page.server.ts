import type { PageServerLoad, Actions } from './$types';
import { containersManager } from '$lib/server/docker';
import type ContainerData from '$lib/server/docker/ContainerData';
import { fail } from '@sveltejs/kit';
import type Container from '$lib/server/docker/Container';

export interface ComposeAppData {
	name: string;
	containers: ContainerData[];
	created: Date;
}

export const load = (async ({ depends }) => {
	depends('app:docker');
	const containers = await containersManager.getContainersData();
	const apps: ComposeAppData[] = [];
	for (const container of containers) {
		if (container.compose) {
			let app = apps.find((app) => app.name === container.compose);
			if (!app) {
				app = {
					name: container.compose,
					containers: [],
					created: container.created
				};
				apps.push(app);
			}
			app.containers.push(container);
			app.created = app.created < container.created ? app.created : container.created;
		}
	}
	return { containers, apps };
}) satisfies PageServerLoad;

export const actions = {
	start: async ({ request }) => {
		const data = await request.formData();
		const containerIds = data.getAll('containers');
		const containers: Container[] = [];
		for (const containerId of containerIds) {
			if (!containerId || typeof containerId !== 'string') {
				return fail(400, { message: 'Invalid container id' });
			}
			const container = await containersManager.getContainer(containerId);
			if (!container) {
				return fail(404, { message: 'Container not found' });
			}
			containers.push(container);
		}
		await Promise.all(containers.map((container) => container.start()));
	},
	stop: async ({ request }) => {
		const data = await request.formData();
		const containerIds = data.getAll('containers');
		const containers: Container[] = [];
		for (const containerId of containerIds) {
			if (!containerId || typeof containerId !== 'string') {
				return fail(400, { message: 'Invalid container id' });
			}
			const container = await containersManager.getContainer(containerId);
			if (!container) {
				return fail(404, { message: 'Container not found' });
			}
			containers.push(container);
		}
		await Promise.all(containers.map((container) => container.stop()));
	},
	restart: async ({ request }) => {
		const data = await request.formData();
		const containerIds = data.getAll('containers');
		const containers: Container[] = [];
		for (const containerId of containerIds) {
			if (!containerId || typeof containerId !== 'string') {
				return fail(400, { message: 'Invalid container id' });
			}
			const container = await containersManager.getContainer(containerId);
			if (!container) {
				return fail(404, { message: 'Container not found' });
			}
			containers.push(container);
		}
		await Promise.all(containers.map((container) => container.restart()));
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const containerIds = data.getAll('containers');
		const containers: Container[] = [];
		for (const containerId of containerIds) {
			if (!containerId || typeof containerId !== 'string') {
				return fail(400, { message: 'Invalid container id' });
			}
			const container = await containersManager.getContainer(containerId);
			if (!container) {
				return fail(404, { message: 'Container not found' });
			}
			containers.push(container);
		}
		await Promise.all(containers.map((container) => container.remove()));
	}
} satisfies Actions;
