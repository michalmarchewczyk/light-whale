import GitService from '$lib/server/sources/git/GitService';
import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type Token from '$lib/server/auth/tokens/Token';
import type GitServiceRepo from '$lib/server/sources/git/GitServiceRepo';
import { logger } from '$lib/server/utils/Logger';

export default class BitbucketService extends GitService {
	public serviceName = 'bitbucket';
	public tokenFields = ['username', 'token'];

	constructor(tokensManager: TokensManager) {
		super(tokensManager);
	}

	async getTokens(): Promise<GitServiceToken[]> {
		logger.logVerbose(`Listing tokens for ${this.serviceName}`);
		const tokens = this.tokensManager.getTokensByService('bitbucket');
		return (
			await Promise.all(
				tokens.map(async (token) => {
					const res = await fetch('https://api.bitbucket.org/2.0/user', {
						method: 'GET',
						headers: {
							Authorization: `Basic ${Buffer.from(token.token, 'utf8').toString('base64')}`
						}
					});
					if (res.status !== 200) {
						return {
							id: token.id,
							service: 'bitbucket',
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
						service: 'bitbucket',
						date: token.date,
						description: token.description,
						login: data.username,
						name: data.display_name,
						avatarUrl: data.links.avatar.href,
						profileUrl: data.links.self.href
					};
				})
			)
		).flat();
	}

	protected async getReposFromToken(token: Token): Promise<GitServiceRepo[]> {
		logger.logVerbose(`Fetching repos for ${token.service} token ${token.id}`);
		const res = await fetch(
			'https://api.bitbucket.org/2.0/repositories?role=contributor&pagelen=100',
			{
				method: 'GET',
				headers: { Authorization: `Basic ${Buffer.from(token.token, 'utf8').toString('base64')}` }
			}
		);
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		return data.values.map(
			(
				repo: Record<
					string,
					string & Record<string, string & Record<number, string & Record<string, string>>>
				>
			): GitServiceRepo => ({
				service: 'bitbucket',
				remoteUrl: repo.links.clone[0].href,
				branchName: repo.mainbranch.name,
				owner: repo.owner.nickname,
				lastCommitDate: repo.updated_on,
				topLanguage: repo.language,
				languages: [repo.language],
				visibility: repo.is_private ? 'private' : 'public',
				tokenId: token.id
			})
		);
	}
}
