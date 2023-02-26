import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import { logger } from '$lib/server/utils/Logger';
import type DnsProviderToken from '$lib/server/dns/DnsProviderToken';

export default abstract class DnsProvider {
	public serviceName = '';

	protected constructor(protected tokensManager: TokensManager) {
		logger.logVerbose(`DnsProvider ${this.serviceName} initialized`);
	}

	abstract getTokens(): Promise<DnsProviderToken[]>;
}
