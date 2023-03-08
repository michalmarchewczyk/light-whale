import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import { logger } from '$lib/server/utils/Logger';
import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';
import type DnsZone from '$lib/server/dns/DnsZone';
import type Token from '$lib/server/auth/tokens/Token';

export default abstract class DnsProvider {
	public serviceName = '';

	protected constructor(protected tokensManager: TokensManager) {
		logger.logVerbose(`DnsProvider ${this.serviceName} initialized`);
	}

	abstract getTokens(): Promise<DnsProviderToken[]>;

	protected abstract getZonesFromToken(token: Token): Promise<DnsZone[]>;

	public async listZones(): Promise<DnsZone[]> {
		logger.logVerbose(`Listing zones for ${this.serviceName}`);
		const tokens = this.tokensManager.getTokensByService(this.serviceName);
		let zones = (
			await Promise.all(
				tokens.map(async (token) => {
					return await this.getZonesFromToken(token);
				})
			)
		).flat();
		zones = zones.filter((r, i, a) => a.findIndex((t) => t.name === r.name) === i);
		return zones;
	}

	public abstract createRecord(domain: string, address: string, zone: DnsZone): Promise<boolean>;

	public abstract deleteRecords(domain: string, zone: DnsZone): Promise<boolean>;

	public abstract deleteRecordsByDomainAndAddress(
		domain: string,
		address: string,
		zone: DnsZone
	): Promise<boolean>;
}
