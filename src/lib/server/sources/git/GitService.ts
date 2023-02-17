import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type Token from '$lib/server/auth/tokens/Token';
import type GitServiceRepo from '$lib/server/sources/git/GitServiceRepo';

export default abstract class GitService {
	public abstract serviceName: string;

	protected constructor(protected tokensManager: TokensManager) {}

	abstract getTokens(): Promise<GitServiceToken[]>;

	protected abstract getReposFromToken(token: Token): Promise<GitServiceRepo[]>;

	public async listRepos(): Promise<GitServiceRepo[]> {
		const tokens = this.tokensManager.getTokensByService(this.serviceName);
		let repos = (
			await Promise.all(
				tokens.map(async (token) => {
					return await this.getReposFromToken(token);
				})
			)
		).flat();
		repos = repos.filter((r, i, a) => a.findIndex((t) => t.remoteUrl === r.remoteUrl) === i);
		return repos;
	}
}
