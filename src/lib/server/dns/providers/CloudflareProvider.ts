import DnsProvider from '$lib/server/dns/DnsProvider';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';
import { logger } from '$lib/server/utils/Logger';
import type Token from '$lib/server/auth/tokens/Token';
import type DnsZone from '$lib/server/dns/DnsZone';
import type DnsRecord from '$lib/server/dns/DnsRecord';

export default class CloudflareProvider extends DnsProvider {
	public serviceName = 'cloudflare';

	constructor(tokensManager: TokensManager) {
		super(tokensManager);
	}

	async getTokens(): Promise<DnsProviderToken[]> {
		logger.logVerbose(`Listing tokens for ${this.serviceName}`);
		const tokens = this.tokensManager.getTokensByService('cloudflare');
		return (
			await Promise.all(
				tokens.map(async (token) => {
					const res = await fetch('https://api.cloudflare.com/client/v4/user', {
						method: 'GET',
						headers: { Authorization: `Bearer ${token.token}` }
					});
					if (res.status !== 200) {
						return {
							id: token.id,
							service: 'cloudflare',
							date: token.date,
							description: token.description,
							name: 'Invalid token',
							login: '-'
						};
					}
					const data = await res.json();
					return {
						id: token.id,
						service: 'cloudflare',
						date: token.date,
						description: token.description,
						login: data.result.email,
						name: data.result.last_name
							? `${data.result.first_name} ${data.result.last_name}`
							: data.result.email
					};
				})
			)
		).flat();
	}

	protected async getZonesFromToken(token: Token): Promise<DnsZone[]> {
		logger.logVerbose(`Fetching zones for ${token.service} token ${token.id}`);
		const res = await fetch('https://api.cloudflare.com/client/v4/zones?per_page=50', {
			method: 'GET',
			headers: { Authorization: `Bearer ${token.token}` }
		});
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		let zones: DnsZone[] = data.result.map((zone: Record<string, string>) => {
			return {
				provider: 'cloudflare',
				id: zone.id,
				name: zone.name,
				records: [],
				modifiedDate: new Date(zone.modified_on),
				tokenId: token.id
			};
		});
		zones = await Promise.all(
			zones.map(async (zone: DnsZone) => {
				zone.records = await this.getZoneRecords(zone.id, token);
				return zone;
			})
		);
		return zones;
	}

	private async getZoneRecords(zoneId: string, token: Token): Promise<DnsRecord[]> {
		const res = await fetch(
			`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=500&type=A,AAAA,CNAME`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token.token}` }
			}
		);
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		return data.result.map(
			(record: Record<string, string & Record<string, string>>): DnsRecord => ({
				provider: 'cloudflare',
				id: record.id,
				name: record.name,
				type: record.type,
				content: record.content,
				ttl: parseInt(record.ttl, 10),
				modifiedDate: new Date(record.modified_on)
			})
		);
	}

	public async createRecord(domain: string, address: string, zone: DnsZone): Promise<boolean> {
		const token = await this.tokensManager.getTokenById(zone.tokenId);
		if (!token) {
			return false;
		}
		const type = address.includes(':') ? 'AAAA' : 'A';
		const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${token.token}` },
			body: JSON.stringify({
				type,
				name: domain,
				content: address,
				ttl: 1
			})
		});
		return res.status === 200;
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
					`https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records/${record.id}`,
					{
						method: 'DELETE',
						headers: { Authorization: `Bearer ${token.token}` }
					}
				);
			})
		);
		return res.every((r) => r.status === 200);
	}
}
