import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { sitesManager } from '$lib/server/sites';

export const actions = {
	pause: async ({ params }) => {
		const site = await sitesManager.getSiteByDomain(params.domain);
		if (!site) {
			return fail(404, { message: 'Site not found' });
		}
		await site.pause();
	},
	unpause: async ({ params }) => {
		const site = await sitesManager.getSiteByDomain(params.domain);
		if (!site) {
			return fail(404, { message: 'Site not found' });
		}
		await site.unpause();
	},
	remove: async ({ params }) => {
		const site = await sitesManager.getSiteByDomain(params.domain);
		if (!site) {
			return fail(404, { message: 'Site not found' });
		}
		await sitesManager.removeSite(site);
	}
} satisfies Actions;
