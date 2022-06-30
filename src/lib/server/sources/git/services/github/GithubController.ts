import type TokenManager from '$lib/server/auth/TokenManager';
import {logger, LogType} from '$lib/server/utils/Logger';
import type {GitServiceController} from '$lib/server/sources/git/services/GitServiceController.interface';
import type {GithubToken} from '$lib/server/sources/git/services/github/GithubToken.interface';
import type {GithubRepo} from '$lib/server/sources/git/services/github/GithubRepo.interface';
import type {Token} from '$lib/server/auth/Token.interface';

export default class GithubController implements GitServiceController {

	constructor(private tokenManager: TokenManager) {}

	public async getTokensInfo():Promise<GithubToken[]> {
		const tokens = this.tokenManager.getTokenByService('github');
		const results:GithubToken[] = (await Promise.all(tokens.map(async (token) => {
			const res = await fetch('https://api.github.com/user', {
				method: 'GET',
				headers: {'Authorization': `token ${token.token}`},
			});
			if(res.status !== 200){
				return [];
			}
			const data = await res.json();
			return {
				id: token.id,
				date: token.date,
				description: token.description,
				login: data.login,
				name: data.name,
				avatarUrl: data.avatar_url,
				url: data.html_url,
			};
		}))).flat();
		return results;
	}


	public async listRepos():Promise<GithubRepo[]> {
		logger.log(LogType.Info, 'Listing GitHub repositories');
		try {
			let repos:GithubRepo[];
			const tokens = this.tokenManager.getTokenByService('github');
			repos = (await Promise.all(tokens.map(async (token) => {
				return await this.getReposFromToken(token);
			}))).flat();
			repos = repos.filter((r,i,a) => a.findIndex((rr) => rr.remoteName === r.remoteName) === i);
			return repos;
		}catch(e){
			logger.log(LogType.Error, 'Something went wrong while listing GitHub repositories');
			return [];
		}
	}

	private async getReposFromToken(token:Token) {
		const res = await fetch('https://api.github.com/user/repos', {
			method: 'GET',
			headers: {'Authorization': `token ${token.token}`},
		});
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		return data.map((repo) => ({
			service: 'github',
			remoteName: repo.clone_url,
			branchName: repo.default_branch,
			author: repo.owner.login,
			lastDate: repo.updated_at,
			topLanguage: repo.language,
			languages: [repo.language],
		}));
	}
}
