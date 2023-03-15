import { adminSitesManager } from '$lib/server/sites';
import type { Actions, PageServerLoad } from './$types';
import { dnsProvidersController } from '$lib/server/dns';
import { nginxManager } from '$lib/server/docker';
import { fail } from '@sveltejs/kit';

export const load = (async ({ depends }) => {
	depends('app:sites');
	const sites = await adminSitesManager.getAdminSites();
	return {
		adminSites: sites.map((s) => s.data),
		info: {
			zones: dnsProvidersController.getCachedZones()
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	publish: async ({ request }) => {
		const data = await request.formData();
		const domain = data.get('domain');
		const zone = data.get('zone');
		if (!domain || typeof domain !== 'string' || !zone || typeof zone !== 'string') {
			return fail(400, { error: 'Invalid domain' });
		}
		let newDomain: string;
		if (zone === 'Custom') {
			newDomain = domain;
		} else if (domain === '@') {
			newDomain = `${zone}`;
		} else {
			newDomain = `${domain}.${zone}`;
		}
		const created = await adminSitesManager.createSite(newDomain);
		if (!created) {
			return fail(400, { error: 'Could not create site' });
		}
		await nginxManager.reload();
	}
} satisfies Actions;
