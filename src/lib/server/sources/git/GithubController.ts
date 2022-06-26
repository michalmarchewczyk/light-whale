import type TokenManager from '$lib/server/auth/TokenManager';
import {tokenManager} from '$lib/server/auth/TokenManager';
import {logger, LogType} from '$lib/server/utils/Logger';
import type {GitServiceController, RemoteRepo, RemoteToken} from '$lib/server/sources/git/GitServiceController';

export interface GithubToken extends RemoteToken {
	id:string;
	date:Date;
	description:string;
	login:string,
	name:string,
	avatarUrl:string,
	url:string,
}

export interface GithubRepo extends RemoteRepo {
	service: string;
	remoteName: string;
	branchName: string;
	author: string;
	lastDate: string;
	topLanguage: string;
	languages: string;
}

class GithubController implements GitServiceController {
	private static instance: GithubController;

	private constructor(private tokenManager: TokenManager) {
	}

	public static getInstance(): GithubController {
		if (!GithubController.instance) {
			GithubController.instance = new GithubController(tokenManager);
		}
		return GithubController.instance;
	}

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
			let repos:GithubRepo[] = [];
			const tokens = this.tokenManager.getTokenByService('github');
			repos = (await Promise.all(tokens.map(async (token) => {
				const res = await fetch('https://api.github.com/user/repos', {
					method: 'GET',
					headers: {'Authorization': `token ${token.token}`},
				});
				if(res.status !== 200){
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
			}))).flat();
			repos = repos.filter((r,i,a) => a.findIndex((rr) => rr.remoteName === r.remoteName) === i);
			return repos;
		}catch(e){
			logger.log(LogType.Error, 'Something went wrong while listing GitHub repositories');
			return [];
		}
	}
}

export const githubController = GithubController.getInstance();

export default GithubController;
