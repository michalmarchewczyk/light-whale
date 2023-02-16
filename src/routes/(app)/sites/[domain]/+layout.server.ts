import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { sitesManager } from '$lib/server/sites';
import { containersManager } from '$lib/server/docker';

export const load = (async ({ params, depends }) => {
	depends('app:docker');
	const site = await sitesManager.getSiteByDomain(params.domain);
	if (!site) {
		throw redirect(307, '/sites');
	}
	const container = await containersManager.getContainer(site.data.containerId);
	return {
		site: site.data,
		siteContainer: container?.data
	};
}) satisfies LayoutServerLoad;
