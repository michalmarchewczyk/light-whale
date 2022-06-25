import {logger, LogType} from '$lib/server/utils/Logger';
import type {RepoInfo} from '$lib/server/sources/git/repos';
import {getServiceTokens} from '$lib/server/auth/tokens';

export const listGithubRepos = async():Promise<Partial<RepoInfo>[]> => {
	logger.log(LogType.Info, 'Listing GitHub repositories');
	try {
		let repos:Partial<RepoInfo>[] = [];
		const tokens = getServiceTokens('github');
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
				lastCommit: '-',
				lastDate: repo.updated_at,
				topLanguage: repo.language,
				languages: [repo.language],
				topFile: '-',
			}));
		}))).flat();
		repos = repos.filter((r,i,a) => a.findIndex((rr) => rr.remoteName === r.remoteName) === i);
		return repos;
	}catch(e){
		logger.log(LogType.Error, 'Something went wrong while listing GitHub repositories');
		return [];
	}
};
