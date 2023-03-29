import type { Actions, PageServerLoad } from './$types';
import { containersManager, nginxManager } from '$lib/server/docker';
import { error, fail } from '@sveltejs/kit';
import { sitesManager } from '$lib/server/sites';
import { dnsProvidersController } from '$lib/server/dns';

export const load = (async ({ params, depends }) => {
	depends('app:sites');
	const container = await containersManager.findContainer(params.id);
	if (!container) {
		throw error(404, { message: 'Container not found' });
	}
	const sites = await sitesManager.getSitesByContainerId(container.id);
	return {
		containerSites: sites.map((s) => s.data),
		info: {
			zones: dnsProvidersController.getCachedZones(),
			ports: nginxManager.scanContainerPorts(container.id)
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	connect: async ({ params }) => {
		const container = await containersManager.findContainer(params.id);
		if (!container) {
			return fail(404, { error: 'Container not found' });
		}
		const connected = await container.connectToLWNetwork();
		if (!connected) {
			return fail(500, { error: 'Failed to connect to network' });
		}
	},
	create: async ({ params, request }) => {
		const container = await containersManager.findContainer(params.id);
		if (!container) {
			return fail(404, { error: 'Container not found' });
		}
		const data = await request.formData();
		const domain = data.get('domain');
		const zone = data.get('zone');
		if (!domain || typeof domain !== 'string' || !zone || typeof zone !== 'string') {
			return fail(400, { error: 'Invalid domain' });
		}
		const port = parseInt(<string>data.get('port'), 10);
		if (!port || isNaN(port)) {
			return fail(400, { error: 'Invalid port' });
		}
		await container.connectToLWNetwork();
		let newDomain: string;
		if (zone === 'Custom') {
			newDomain = domain;
		} else if (domain === '@') {
			newDomain = `${zone}`;
		} else {
			newDomain = `${domain}.${zone}`;
		}
		const created = await sitesManager.createSite(container.id, newDomain, port);
		if (!created) {
			return fail(400, { error: 'Site already exists' });
		}
		await nginxManager.reload();
	}
} satisfies Actions;
