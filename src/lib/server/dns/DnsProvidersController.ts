import { logger } from '$lib/server/utils/Logger';
import type DnsProvider from '$lib/server/dns/DnsProvider';
import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';
import type DnsZone from '$lib/server/dns/DnsZone';

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
			return false;
		}
		const provider = this.providers.find((p) => p.serviceName === zone.provider);
		if (!provider) {
			return false;
		}
		return await provider.createRecord(domain, address, zone);
	}

	public async deleteRecords(domain: string) {
		logger.logInfo(`Deleting DNS records for ${domain}`);
		const zones = await this.listAllZones();
		const zone = zones.find((z) => domain.endsWith(z.name));
		if (!zone) {
			return false;
		}
		const provider = this.providers.find((p) => p.serviceName === zone.provider);
		if (!provider) {
			return false;
		}
		return await provider.deleteRecords(domain, zone);
	}

	public async deleteRecordByDomainAndAddress(domain: string, address: string) {
		logger.logInfo(`Deleting DNS record for ${domain} with address ${address}`);
		const zones = await this.listAllZones();
		const zone = zones.find((z) => domain.endsWith(z.name));
		if (!zone) {
			return false;
		}
		const provider = this.providers.find((p) => p.serviceName === zone.provider);
		if (!provider) {
			return false;
		}
		return await provider.deleteRecordsByDomainAndAddress(domain, address, zone);
	}
}
