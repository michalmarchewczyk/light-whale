import { logger } from '$lib/server/utils/Logger';
import type GitService from '$lib/server/sources/git/GitService';
import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
import type GitServiceRepo from '$lib/server/sources/git/GitServiceRepo';

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

	public async listAllRepos(): Promise<GitServiceRepo[]> {
		const repos: GitServiceRepo[] = [];
		for (const service of this.services) {
			repos.push(...(await service.listRepos()));
		}
		repos.sort((a, b) => {
			const aDate = new Date(a.lastCommitDate);
			const bDate = new Date(b.lastCommitDate);
			return bDate.getTime() - aDate.getTime();
		});
		return repos;
	}

	public async getRepoByRemoteUrl(remoteUrl: string): Promise<GitServiceRepo | null> {
		const repos = await this.listAllRepos();
		return repos.find((r) => r.remoteUrl === remoteUrl) ?? null;
	}

	public async getTokenById(tokenId: string): Promise<GitServiceToken | null> {
		const tokens = await this.listAllTokens();
		return tokens.find((t) => t.id === tokenId) ?? null;
	}
}
