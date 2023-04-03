import GitService from '$lib/server/sources/git/GitService';
import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type Token from '$lib/server/auth/tokens/Token';
import type GitServiceRepo from '$lib/server/sources/git/GitServiceRepo';
import { logger } from '$lib/server/utils/Logger';

export default class JetbrainsSpaceService extends GitService {
	public serviceName = 'jetbrainsspace';
	public tokenFields = ['project name', 'token'];

	constructor(tokensManager: TokensManager) {
		super(tokensManager);
	}

	async getTokens(): Promise<GitServiceToken[]> {
		logger.logVerbose(`Listing tokens for ${this.serviceName}`);
		const tokens = this.tokensManager.getTokensByService('jetbrainsspace');
		return (
			await Promise.all(
				tokens.map(async (token) => {
					const res = await fetch(
						`https://${
							token.token.split(':')[0]
						}.jetbrains.space/api/http/team-directory/profiles/me`,
						{
							method: 'GET',
							headers: {
								Authorization: `Bearer ${token.token.split(':')[1]}`
							}
						}
					);
					if (res.status !== 200) {
						return {
							id: token.id,
							service: 'jetbrainsspace',
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
						service: 'jetbrainsspace',
						date: token.date,
						description: token.description,
						login: data.username,
						name: data.name.firstName + ' ' + data.name.lastName,
						avatarUrl: data.smallAvatar ? await this.getAvatarUrl(token, data.smallAvatar) : '',
						profileUrl: ''
					};
				})
			)
		).flat();
	}

	private async getAvatarUrl(token: Token, avatarId: string) {
		const url = `https://${token.token.split(':')[0]}.jetbrains.space/d/${avatarId}`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token.token.split(':')[1]}`
			}
		});
		if (res.status === 200) {
			return `data:${res.headers.get('content-type')};base64,${Buffer.from(
				await res.arrayBuffer()
			).toString('base64')}`;
		}
		return '';
	}

	protected async getReposFromToken(token: Token): Promise<GitServiceRepo[]> {
		logger.logVerbose(`Fetching repos for ${token.service} token ${token.id}`);
		const res = await fetch(
			`https://${
				token.token.split(':')[0]
			}.jetbrains.space/api/http/projects/repositories/find?term=`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token.token.split(':')[1]}`
				}
			}
		);
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		return await Promise.all(
			data.data.map(async (repo: Record<string, string>) => {
				return await this.getRepoInfo(token, repo.projectKey, repo.repository);
			})
		);
	}

	private async getRepoInfo(
		token: Token,
		projectKey: string,
		repoName: string
	): Promise<GitServiceRepo> {
		const res1 = await fetch(
			`https://${
				token.token.split(':')[0]
			}.jetbrains.space/api/http/projects/key:${projectKey}/repositories/${repoName}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token.token.split(':')[1]}`
				}
			}
		);
		const res2 = await fetch(
			`https://${
				token.token.split(':')[0]
			}.jetbrains.space/api/http/projects/key:${projectKey}/repositories/${repoName}/url`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token.token.split(':')[1]}`
				}
			}
		);
		if (res1.status !== 200) {
			return {
				service: 'jetbrainsspace',
				remoteUrl: '',
				branchName: '',
				owner: '',
				lastCommitDate: '',
				topLanguage: '',
				languages: [],
				visibility: '',
				tokenId: token.id
			};
		}
		const data1 = await res1.json();
		const data2 = await res2.json();
		return {
			service: 'jetbrainsspace',
			remoteUrl: data2.httpUrl,
			branchName: data1.defaultBranch.head,
			owner: '-',
			lastCommitDate: data1.latestActivity || '',
			topLanguage: '',
			languages: [],
			visibility: 'private',
			tokenId: token.id
		};
	}
}
