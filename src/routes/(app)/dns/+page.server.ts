import type { Actions, PageServerLoad } from './$types';
import { dnsProvidersController, ipSettingsController } from '$lib/server/dns';
import { sitesManager } from '$lib/server/sites';
import { fail } from '@sveltejs/kit';

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

export const actions = {
	remove: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('record_name');
		if (typeof name !== 'string') {
			return fail(400, { message: 'Invalid name' });
		}
		const content = data.get('record_content');
		if (typeof content !== 'string') {
			return fail(400, { message: 'Invalid content' });
		}
		const deleted = await dnsProvidersController.deleteRecordByDomainAndAddress(name, content);
		if (!deleted) {
			return fail(400, { message: 'Failed to delete record' });
		}
	}
} satisfies Actions;
