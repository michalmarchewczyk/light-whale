import type { PageServerLoad } from './$types';
import { sitesManager } from '$lib/server/sites';
import { containersManager } from '$lib/server/docker';

export const load = (async ({ depends }) => {
	depends('app:sites');
	depends('app:docker');
	const sites = await sitesManager.getSitesData();
	const containers = await containersManager.getContainersData();
	return { sites, containers };
}) satisfies PageServerLoad;
