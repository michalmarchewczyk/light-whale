import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { sitesManager } from '$lib/server/sites';
import { nginxManager } from '$lib/server/docker';

export const actions = {
	pause: async ({ params }) => {
		const site = await sitesManager.getSiteByDomain(params.domain);
		if (!site) {
			return fail(404, { message: 'Site not found' });
		}
		await site.pause();
		await nginxManager.reload();
	},
	unpause: async ({ params }) => {
		const site = await sitesManager.getSiteByDomain(params.domain);
		if (!site) {
			return fail(404, { message: 'Site not found' });
		}
		await site.unpause();
		await nginxManager.reload();
	},
	remove: async ({ params }) => {
		const site = await sitesManager.getSiteByDomain(params.domain);
		if (!site) {
			return fail(404, { message: 'Site not found' });
		}
		await sitesManager.removeSite(site);
		await nginxManager.reload();
	}
} satisfies Actions;
