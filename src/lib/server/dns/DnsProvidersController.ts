import { logger } from '$lib/server/utils/Logger';
import type DnsProvider from '$lib/server/dns/DnsProvider';
import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';
import type DnsZone from '$lib/server/dns/DnsZone';
import { eventsController } from '$lib/server/events/EventsController';

export default class DnsProvidersController {
	private cachedZones: DnsZone[] = [];

	constructor(private providers: DnsProvider[] = []) {
		logger.logVerbose('DnsProvidersController initialized');
	}

	public async listAllTokens(): Promise<DnsProviderToken[]> {
		logger.logVerbose('Listing all dns providers tokens');
		const tokens: DnsProviderToken[] = [];
		for (const provider of this.providers) {
			tokens.push(...(await provider.getTokens()));
		}
		return tokens;
	}

	public async listAllZones(): Promise<DnsZone[]> {
		logger.logVerbose('Listing all dns zones');
		const zones: DnsZone[] = (
			await Promise.all(
				this.providers.map(async (provider) => {
					return await provider.listZones();
				})
			)
		).flat();
		zones.sort((a, b) => {
			const aDate = new Date(a.modifiedDate);
			const bDate = new Date(b.modifiedDate);
			return bDate.getTime() - aDate.getTime();
		});
		this.cachedZones = zones;
		return zones;
	}

	public async getCachedZones() {
		if (this.cachedZones.length === 0) {
			await this.listAllZones();
		}
		return this.cachedZones;
	}

	public async createRecord(domain: string, address: string) {
		logger.logInfo(`Creating DNS record for ${domain} with address ${address}`);
		const zones = await this.listAllZones();
		const zone = zones.find((z) => domain.endsWith(z.name));
		if (!zone) {
			eventsController.push({
				type: 'error',
				title: 'Failed to create DNS record',
				message: `Could not find a DNS zone for domain ${domain}`
			});
			return false;
		}
		const provider = this.providers.find((p) => p.serviceName === zone.provider);
		if (!provider) {
			eventsController.push({
				type: 'error',
				title: 'Failed to create DNS record',
				message: `Could not find a DNS zone for domain ${domain}`
			});
			return false;
		}
		if (zone.records.some((r) => r.name === domain && r.content === address)) {
			eventsController.push({
				type: 'success',
				title: 'Created DNS record',
				message: `DNS record for ${domain} with address ${address} already exists`
			});
			return true;
		}
		eventsController.push({
			type: 'success',
			title: 'Created DNS record',
			message: `DNS record for ${domain} with address ${address} created`
		});
		return await provider.createRecord(domain, address, zone);
	}

	public async deleteRecords(domain: string) {
		logger.logInfo(`Deleting DNS records for ${domain}`);
		const zones = await this.listAllZones();
		const zone = zones.find((z) => domain.endsWith(z.name));
		if (!zone) {
			eventsController.push({
				type: 'error',
				title: 'Failed to delete DNS records',
				message: `Could not find a DNS zone for domain ${domain}`
			});
			return false;
		}
		const provider = this.providers.find((p) => p.serviceName === zone.provider);
		if (!provider) {
			eventsController.push({
				type: 'error',
				title: 'Failed to delete DNS records',
				message: `Could not find a DNS zone for domain ${domain}`
			});
			return false;
		}
		eventsController.push({
			type: 'success',
			title: 'Deleted DNS records',
			message: `DNS records for ${domain} deleted`
		});
		return await provider.deleteRecords(domain, zone);
	}

	public async deleteRecordByDomainAndAddress(domain: string, address: string) {
		logger.logInfo(`Deleting DNS record for ${domain} with address ${address}`);
		const zones = await this.listAllZones();
		const zone = zones.find((z) => domain.endsWith(z.name));
		if (!zone) {
			eventsController.push({
				type: 'error',
				title: 'Failed to delete DNS record',
				message: `Could not find a DNS zone for domain ${domain}`
			});
			return false;
		}
		const provider = this.providers.find((p) => p.serviceName === zone.provider);
		if (!provider) {
			eventsController.push({
				type: 'error',
				title: 'Failed to delete DNS record',
				message: `Could not find a DNS zone for domain ${domain}`
			});
			return false;
		}
		eventsController.push({
			type: 'success',
			title: 'Deleted DNS record',
			message: `DNS record for ${domain} with address ${address} deleted`
		});
		return await provider.deleteRecordsByDomainAndAddress(domain, address, zone);
	}
}
