import { logger } from '$lib/server/utils/Logger';
import type GitService from '$lib/server/sources/git/GitService';
import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';

export default class GitServicesController {
	constructor(private services: GitService[] = []) {
		logger.logVerbose('GitServicesController initialized');
	}

	public async listAllTokens(): Promise<GitServiceToken[]> {
		const tokens: GitServiceToken[] = [];
		for (const service of this.services) {
			tokens.push(...(await service.getTokens()));
		}
		return tokens;
	}
}
