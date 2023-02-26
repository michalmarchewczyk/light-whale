import type { PageServerLoad } from './$types';
import { dnsProvidersController } from '$lib/server/dns';

export const load = (async ({ depends }) => {
	depends('app:dns');
	const zones = await dnsProvidersController.listAllZones();
	return {
		zones
	};
}) satisfies PageServerLoad;
