import DnsProvider from '$lib/server/dns/DnsProvider';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';
import { logger } from '$lib/server/utils/Logger';
import type Token from '$lib/server/auth/tokens/Token';
import type DnsZone from '$lib/server/dns/DnsZone';
import type DnsRecord from '$lib/server/dns/DnsRecord';

export default class DigitalOceanProvider extends DnsProvider {
	public serviceName = 'digitalocean';

	constructor(tokensManager: TokensManager) {
		super(tokensManager);
	}

	async getTokens(): Promise<DnsProviderToken[]> {
		logger.logVerbose(`Listing tokens for ${this.serviceName}`);
		const tokens = this.tokensManager.getTokensByService('digitalocean');
		return (
			await Promise.all(
				tokens.map(async (token) => {
					const res = await fetch('https://api.digitalocean.com/v2/account', {
						method: 'GET',
						headers: { Authorization: `Bearer ${token.token}` }
					});
					if (res.status !== 200) {
						return {
							id: token.id,
							service: 'digitalocean',
							date: token.date,
							description: token.description,
							name: 'Invalid token',
							login: '-'
						};
					}
					const data = await res.json();
					return {
						id: token.id,
						service: 'digitalocean',
						date: token.date,
						description: token.description,
						login: data.account.email,
						name: data.account.email
					};
				})
			)
		).flat();
	}

	protected async getZonesFromToken(token: Token): Promise<DnsZone[]> {
		logger.logVerbose(`Fetching zones for ${token.service} token ${token.id}`);
		const res = await fetch('https://api.digitalocean.com/v2/domains', {
			method: 'GET',
			headers: { Authorization: `Bearer ${token.token}` }
		});
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		let zones: DnsZone[] = data.domains.map((zone: Record<string, string>) => {
			return {
				provider: 'digitalocean',
				id: zone.name,
				name: zone.name,
				records: [],
				modifiedDate: new Date(0),
				tokenId: token.id
			};
		});
		zones = await Promise.all(
			zones.map(async (zone: DnsZone) => {
				zone.records = await this.getZoneRecords(zone.name, token);
				return zone;
			})
		);
		return zones;
	}

	private async getZoneRecords(zoneName: string, token: Token): Promise<DnsRecord[]> {
		const res = await fetch(
			`https://api.digitalocean.com/v2/domains/${zoneName}/records?per_page=100`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token.token}` }
			}
		);
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		return data.domain_records
			.map(
				(record: Record<string, string & number>): DnsRecord => ({
					provider: 'digitalocean',
					id: record.id,
					name: (record.name ? record.name + '.' : '') + zoneName,
					type: record.type,
					content: record.data,
					ttl: record.ttl,
					modifiedDate: new Date(0)
				})
			)
			.filter((record: DnsRecord) => ['A', 'AAAA', 'CNAME'].includes(record.type));
	}

	public async createRecord(domain: string, address: string, zone: DnsZone): Promise<boolean> {
		const token = await this.tokensManager.getTokenById(zone.tokenId);
		if (!token) {
			return false;
		}
		const type = address.includes(':') ? 'AAAA' : 'A';
		const res = await fetch(`https://api.digitalocean.com/v2/domains/${zone.name}/records`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${token.token}` },
			body: JSON.stringify({
				type,
				name: domain.replace(`.${zone.name}`, ''),
				data: address,
				ttl: 30
			})
		});
		return res.status === 201;
	}

	public async deleteRecords(domain: string, zone: DnsZone): Promise<boolean> {
		const token = await this.tokensManager.getTokenById(zone.tokenId);
		if (!token) {
			return false;
		}
		const records = zone.records.filter((record) => record.name === domain);
		const res = await Promise.all(
			records.map(async (record) => {
				return await fetch(
					`https://api.digitalocean.com/v2/domains/${zone.name}/records/${record.id}`,
					{
						method: 'DELETE',
						headers: { Authorization: `Bearer ${token.token}` }
					}
				);
			})
		);
		return res.every((r) => r.status === 204);
	}

	public async deleteRecordsByDomainAndAddress(
		domain: string,
		address: string,
		zone: DnsZone
	): Promise<boolean> {
		const token = await this.tokensManager.getTokenById(zone.tokenId);
		if (!token) {
			return false;
		}
		const records = zone.records.filter(
			(record) => record.name === domain && record.content === address
		);
		const res = await Promise.all(
			records.map(async (record) => {
				return await fetch(
					`https://api.digitalocean.com/v2/domains/${zone.name}/records/${record.id}`,
					{
						method: 'DELETE',
						headers: { Authorization: `Bearer ${token.token}` }
					}
				);
			})
		);
		return res.every((r) => r.status === 204);
	}
}
