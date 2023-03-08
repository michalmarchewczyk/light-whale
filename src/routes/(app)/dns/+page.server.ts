import type { PageServerLoad } from './$types';
import { dnsProvidersController, ipSettingsController } from '$lib/server/dns';
import { sitesManager } from '$lib/server/sites';

export const load = (async ({ depends }) => {
	depends('app:dns');
	depends('app:sites');
	const ipAddresses = [
		...ipSettingsController.listV4Addresses(),
		...ipSettingsController.listV6Addresses()
	];
	return {
		dns: {
			zones: dnsProvidersController.listAllZones()
		},
		sites: sitesManager.getSitesData(),
		ipAddresses
	};
}) satisfies PageServerLoad;
