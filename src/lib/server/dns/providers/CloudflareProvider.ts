import DnsProvider from '$lib/server/dns/DnsProvider';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';
import { logger } from '$lib/server/utils/Logger';

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
}
