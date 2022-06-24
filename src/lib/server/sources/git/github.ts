import {logger, LogType} from '$lib/server/utils/Logger';
import type {RepoInfo} from '$lib/server/sources/git/repos';
import {getServiceTokens} from '$lib/server/auth/tokens';

export const listGithubRepos = async():Promise<Partial<RepoInfo>[]> => {
	logger.log(LogType.Info, 'Listing GitHub repositories');
	try {
		const repos:Partial<RepoInfo>[] = [];
		const tokens = getServiceTokens('github');
		for(const token of tokens){
			const res = await fetch('https://api.github.com/user/repos', {
				method: 'GET',
				headers: {'Authorization': `token ${token.token}`},
			});
			if(res.status !== 200){
				continue;
			}
			const data = await res.json();
			for(const repo of data){
				if(repos.find(r => r.remoteName === repo.clone_url)){
					continue;
				}
				repos.push({
					service: 'github',
					remoteName: repo.clone_url,
					branchName: repo.default_branch,
					author: repo.owner.login,
					lastCommit: '-',
					lastDate: repo.updated_at,
					topLanguage: repo.language,
					languages: [repo.language],
					topFile: '-',
				});
			}
		}

		return repos;
	}catch(e){
		logger.log(LogType.Error, 'Something went wrong while listing GitHub repositories');
		return [];
	}
};
