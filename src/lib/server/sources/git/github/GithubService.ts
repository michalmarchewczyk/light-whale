import GitService from '$lib/server/sources/git/GitService';
import type GitServiceToken from '$lib/server/sources/git/GitServiceToken';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';

export default class GithubService extends GitService {
	public static serviceName = 'github';

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
}
