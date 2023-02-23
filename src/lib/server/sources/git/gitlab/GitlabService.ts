import GitService from '$lib/server/sources/git/GitService';
import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type Token from '$lib/server/auth/tokens/Token';
import type GitServiceRepo from '$lib/server/sources/git/GitServiceRepo';
import { logger } from '$lib/server/utils/Logger';

export default class GitlabService extends GitService {
	public serviceName = 'gitlab';

	constructor(tokensManager: TokensManager) {
		super(tokensManager);
	}

	async getTokens(): Promise<GitServiceToken[]> {
		logger.logVerbose(`Listing tokens for ${this.serviceName}`);
		const tokens = this.tokensManager.getTokensByService('gitlab');
		return (
			await Promise.all(
				tokens.map(async (token) => {
					const res = await fetch('https://gitlab.com/api/v4/user', {
						method: 'GET',
						headers: { Authorization: `Bearer ${token.token}` }
					});
					if (res.status !== 200) {
						return {
							id: token.id,
							service: 'gitlab',
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
						service: 'gitlab',
						date: token.date,
						description: token.description,
						login: data.username,
						name: data.name,
						avatarUrl: data.avatar_url,
						profileUrl: data.web_url
					};
				})
			)
		).flat();
	}

	protected async getReposFromToken(token: Token): Promise<GitServiceRepo[]> {
		logger.logVerbose(`Fetching repos for ${token.service} token ${token.id}`);
		const res = await fetch('https://gitlab.com/api/v4/projects?owned=true&statistics=true', {
			method: 'GET',
			headers: { Authorization: `Bearer ${token.token}` }
		});
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		const languages = await Promise.all(
			data.map(async (repo: Record<string, string>) => {
				return {
					id: repo.id,
					languages: await this.getRepoLanguages(repo.id, token)
				};
			})
		);
		return data.map(
			(repo: Record<string, string & Record<string, string>>): GitServiceRepo => ({
				service: 'gitlab',
				remoteUrl: repo.http_url_to_repo,
				branchName: repo.default_branch,
				owner: repo.owner.username,
				lastCommitDate: repo.last_activity_at,
				topLanguage: languages.find((l) => l.id === repo.id)?.languages[0] ?? '',
				languages: languages.find((l) => l.id === repo.id)?.languages ?? [],
				visibility: repo.visibility,
				tokenId: token.id
			})
		);
	}

	private async getRepoLanguages(projectId: string, token: Token): Promise<string[]> {
		const res = await fetch(`https://gitlab.com/api/v4/projects/${projectId}/languages`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token.token}` }
		});
		if (res.status !== 200) {
			return [];
		}
		return Object.entries<number>(await res.json())
			.filter((l) => l[1] > 1)
			.map((l) => l[0]);
	}
}
