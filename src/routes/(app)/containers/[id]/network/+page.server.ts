import type { Actions, PageServerLoad } from './$types';
import { containersManager, nginxManager } from '$lib/server/docker';
import { fail } from '@sveltejs/kit';
import { sitesManager } from '$lib/server/sites';

export const load = (async ({ params, depends }) => {
	depends('app:sites');
	const container = await containersManager.findContainer(params.id);
	if (!container) {
		return fail(404, { message: 'Container not found' });
	}
	const sites = await sitesManager.getSitesByContainerId(container.id);
	return { containerSites: sites.map((s) => s.data) };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ params, request }) => {
		const container = await containersManager.findContainer(params.id);
		if (!container) {
			return fail(404, { error: 'Container not found' });
		}
		const data = await request.formData();
		const domain = data.get('domain');
		if (!domain || typeof domain !== 'string') {
			return fail(400, { error: 'Invalid domain' });
		}
		const port = parseInt(<string>data.get('port'), 10);
		if (!port || isNaN(port)) {
			return fail(400, { error: 'Invalid port' });
		}
		await container.connectToLWNetwork();
		const created = await sitesManager.createSite(container.id, domain, port);
		if (!created) {
			return fail(400, { error: 'Site already exists' });
		}
		await nginxManager.reload();
	}
} satisfies Actions;
