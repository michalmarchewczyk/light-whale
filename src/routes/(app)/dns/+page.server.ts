import type { PageServerLoad } from './$types';
import { dnsProvidersController } from '$lib/server/dns';
import { sitesManager } from '$lib/server/sites';

export const load = (async ({ depends }) => {
	depends('app:dns');
	depends('app:sites');
	return {
		dns: {
			zones: dnsProvidersController.listAllZones()
		},
		sites: sitesManager.getSitesData()
	};
}) satisfies PageServerLoad;
