import type { PageServerLoad } from '../$types';
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
