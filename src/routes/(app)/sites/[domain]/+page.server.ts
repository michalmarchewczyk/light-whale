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
	},
	changeSsl: async ({ params, request }) => {
		const site = await sitesManager.getSiteByDomain(params.domain);
		if (!site) {
			return fail(404, { message: 'Site not found' });
		}
		const data = await request.formData();
		const ssl = data.get('ssl') === 'on';
		if (ssl) {
			await site.enableSsl();
		} else {
			await site.disableSsl();
		}
		await nginxManager.reload();
	}
} satisfies Actions;
