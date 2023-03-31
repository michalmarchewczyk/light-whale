import DnsProvider from '$lib/server/dns/DnsProvider';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';
import { logger } from '$lib/server/utils/Logger';
import type Token from '$lib/server/auth/tokens/Token';
import type DnsZone from '$lib/server/dns/DnsZone';
import type DnsRecord from '$lib/server/dns/DnsRecord';
import crypto from 'crypto';

export default class OvhProvider extends DnsProvider {
	public serviceName = 'ovh';
	public tokenFields = ['app key', 'app secret', 'consumer key'];

	constructor(tokensManager: TokensManager) {
		super(tokensManager);
	}

	private async makeRequest(token: Token, method: string, url: string, body = '') {
		const time = await fetch('https://eu.api.ovh.com/1.0/auth/time').then((res) => res.text());
		const [appKey, appSecret, consumerKey] = token.token.split(':');
		const signature = `${appSecret}+${consumerKey}+${method}+https://eu.api.ovh.com/1.0${url}+${body}+${time}`;
		const hash = '$1$' + crypto.createHash('sha1').update(signature).digest('hex');
		return await fetch(`https://eu.api.ovh.com/1.0${url}`, {
			method,
			headers: {
				'Content-Type': 'application/json',
				'X-Ovh-Application': appKey,
				'X-Ovh-Signature': hash,
				'X-Ovh-Timestamp': time,
				'X-Ovh-Consumer': consumerKey
			},
			body: body ? body : undefined
		});
	}

	async getTokens(): Promise<DnsProviderToken[]> {
		logger.logVerbose(`Listing tokens for ${this.serviceName}`);
		const tokens = this.tokensManager.getTokensByService('ovh');
		return (
			await Promise.all(
				tokens.map(async (token) => {
					const res = await this.makeRequest(token, 'GET', '/me');
					if (res.status !== 200) {
						return {
							id: token.id,
							service: 'ovh',
							date: token.date,
							description: token.description,
							name: 'Invalid token',
							login: '-'
						};
					}
					const data = await res.json();
					return {
						id: token.id,
						service: 'ovh',
						date: token.date,
						description: token.description,
						login: data.nichandle,
						name: data.firstname + ' ' + data.name
					};
				})
			)
		).flat();
	}

	protected async getZonesFromToken(token: Token): Promise<DnsZone[]> {
		logger.logVerbose(`Fetching zones for ${token.service} token ${token.id}`);
		const res = await this.makeRequest(token, 'GET', '/domain/zone');
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		let zones: DnsZone[] = data.map((zone: string) => {
			return {
				provider: 'ovh',
				id: zone,
				name: zone,
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
		const res = await this.makeRequest(token, 'GET', `/domain/zone/${zoneName}/record`);
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		return (
			await Promise.all(
				data.map(async (recordId: string) => {
					return this.getRecordData(zoneName, recordId, token);
				})
			)
		)
			.filter((record) => record !== null)
			.filter((record) => ['A', 'AAAA', 'CNAME'].includes(record.type));
	}

	private async getRecordData(
		zoneName: string,
		recordId: string,
		token: Token
	): Promise<DnsRecord | null> {
		const res = await this.makeRequest(token, 'GET', `/domain/zone/${zoneName}/record/${recordId}`);
		if (res.status !== 200) {
			return null;
		}
		const data = await res.json();
		return {
			provider: 'ovh',
			id: data.id.toString(),
			name: (data.subDomain ? data.subDomain + '.' : '') + data.zone,
			type: data.fieldType,
			content: data.target,
			ttl: data.ttl,
			modifiedDate: new Date(0)
		};
	}

	public async createRecord(domain: string, address: string, zone: DnsZone): Promise<boolean> {
		const token = await this.tokensManager.getTokenById(zone.tokenId);
		if (!token) {
			return false;
		}
		const type = address.includes(':') ? 'AAAA' : 'A';
		const res = await this.makeRequest(
			token,
			'POST',
			`/domain/zone/${zone.name}/record`,
			JSON.stringify({
				fieldType: type,
				subDomain: domain.replace('.' + zone.name, ''),
				target: address,
				ttl: 1
			})
		);
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
				return await this.makeRequest(
					token,
					'DELETE',
					`/domain/zone/${zone.name}/record/${record.id}`
				);
			})
		);
		return res.every((r) => r.status === 200);
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
				return await this.makeRequest(
					token,
					'DELETE',
					`/domain/zone/${zone.name}/record/${record.id}`
				);
			})
		);
		return res.every((r) => r.status === 200);
	}
}
