import { logger } from '$lib/server/utils/Logger';
import type DnsProvider from '$lib/server/dns/DnsProvider';
import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';

export default class DnsProvidersController {
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
}
