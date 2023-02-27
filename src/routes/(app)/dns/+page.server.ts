import type { PageServerLoad } from './$types';
import { dnsProvidersController } from '$lib/server/dns';

export const load = (async ({ depends }) => {
	depends('app:dns');
	return {
		dns: {
			zones: dnsProvidersController.listAllZones()
		}
	};
}) satisfies PageServerLoad;
