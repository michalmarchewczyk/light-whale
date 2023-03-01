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
}
