import GitService from '$lib/server/sources/git/GitService';
import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type Token from '$lib/server/auth/tokens/Token';
import type GitServiceRepo from '$lib/server/sources/git/GitServiceRepo';
import { logger } from '$lib/server/utils/Logger';

export default class GithubService extends GitService {
	public serviceName = 'github';

	constructor(tokensManager: TokensManager) {
		super(tokensManager);
	}

	async getTokens(): Promise<GitServiceToken[]> {
		const tokens = this.tokensManager.getTokensByService('github');
		return (
			await Promise.all(
				tokens.map(async (token) => {
					const res = await fetch('https://api.github.com/user', {
						method: 'GET',
						headers: { Authorization: `token ${token.token}` }
					});
					if (res.status !== 200) {
						return {
							id: token.id,
							service: 'github',
							date: token.date,
							description: token.description,
							name: 'Invalid token',
							login: '-',
							avatarUrl: '',
							profileUrl: ''
						};
					}
					const data = await res.json();
					return {
						id: token.id,
						service: 'github',
						date: token.date,
						description: token.description,
						login: data.login,
						name: data.name,
						avatarUrl: data.avatar_url,
						profileUrl: data.html_url
					};
				})
			)
		).flat();
	}

	protected async getReposFromToken(token: Token): Promise<GitServiceRepo[]> {
		logger.logVerbose(`Fetching repos for ${token.service} token ${token.id}`);
		const res = await fetch('https://api.github.com/user/repos', {
			method: 'GET',
			headers: { Authorization: `token ${token.token}` }
		});
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		return data.map(
			(repo: Record<string, string & Record<string, string>>): GitServiceRepo => ({
				service: 'github',
				remoteUrl: repo.clone_url,
				branchName: repo.default_branch,
				owner: repo.owner.login,
				lastCommitDate: repo.pushed_at,
				topLanguage: repo.language,
				languages: [repo.language],
				visibility: repo.visibility,
				tokenId: token.id
			})
		);
	}
}
