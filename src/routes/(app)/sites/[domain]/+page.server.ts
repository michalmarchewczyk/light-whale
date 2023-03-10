import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { sitesManager } from '$lib/server/sites';
import type { PageServerLoad } from './$types';
import { nginxManager } from '$lib/server/docker';
import { dnsProvidersController, ipSettingsController } from '$lib/server/dns';

const getDnsInfo = async (domain: string) => {
	const zones = await dnsProvidersController.listAllZones();
	const ipAddresses = [
		...ipSettingsController.listV4Addresses(),
		...ipSettingsController.listV6Addresses()
	];
	const zone = zones.find((z) => domain.endsWith(z.name));
	const records = zone?.records.filter((r) => r.name === domain) ?? [];
	const added = ipAddresses.filter((ip) =>
		records.some((r) => r.name === domain && r.content === ip)
	);
	const missing = ipAddresses.filter(
		(ip) => !records.some((r) => r.name === domain && r.content === ip)
	);
	return {
		added,
		missing
	};
};

export const load = (async ({ depends, parent }) => {
	depends('app:dns');
	const { site } = await parent();
	return {
		dns: {
			added: getDnsInfo(site.domain).then((i) => i.added),
			missing: getDnsInfo(site.domain).then((i) => i.missing)
		}
	};
}) satisfies PageServerLoad;

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
	},
	fix: async ({ params }) => {
		const site = await sitesManager.getSiteByDomain(params.domain);
		if (!site) {
			return fail(404, { message: 'Site not found' });
		}
		const ipAddresses = [
			...ipSettingsController.listV4Addresses(),
			...ipSettingsController.listV6Addresses()
		];
		const added = await Promise.all(
			ipAddresses.map((ip) => dnsProvidersController.createRecord(site.data.domain, ip))
		);
		if (!added.every((a) => a)) {
			return fail(500, { message: 'Failed to add DNS records' });
		}
	}
} satisfies Actions;
