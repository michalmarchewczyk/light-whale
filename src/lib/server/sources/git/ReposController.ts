import fs from 'fs/promises';
import path from 'path';
import {logger, LogType} from '$lib/server/utils/Logger';
import type {SimpleGit} from 'simple-git';
import type RepoAnalyzer from '$lib/server/sources/git/RepoAnalyzer';
import type {Repo} from '$lib/server/sources/git/Repo.interface';
import type RepoBuilder from '$lib/server/sources/git/RepoBuilder';
import {tokenManager} from '$lib/server/auth';

export default class ReposController {
	public static gitSourcesPath = path.join(process.cwd(), 'git-sources');

	constructor(private git:SimpleGit, private repoAnalyzer:RepoAnalyzer, private repoBuilder:RepoBuilder) {}

	private async pullRepo(repoUrl:string, pullUrl, repoDir:string) {
		try {
			await fs.access(repoDir);
			logger.log(LogType.Info, `Pulling git repository ${repoUrl}`);
			await this.git.cwd({path: repoDir}).pull(pullUrl);
			return true;
		} catch (e) {
			try {
				logger.log(LogType.Info, `Fetching git repository ${repoUrl}`);
				await fs.mkdir(repoDir);
				await this.git.cwd({path: repoDir}).init().pull(pullUrl, 'master').addRemote('origin', repoUrl);
				return true;
			} catch (e) {
				logger.log(LogType.Error, `Could not fetch git repository ${repoUrl}`);
				return false;
			}
		}
	}

	public async fetchRepo(repoUrl:string, tokenId?:string, service?:string):Promise<Repo | null> {
		const repoDir = path.join(ReposController.gitSourcesPath, encodeURIComponent(repoUrl));
		let pullUrl = repoUrl;
		if(tokenId){
			const token = tokenManager.getTokenById(tokenId);
			const url = new URL(repoUrl);
			url.username = token.token;
			pullUrl = url.href;
		}
		const pulled = await this.pullRepo(repoUrl, pullUrl, repoDir);
		if(!pulled){
			return null;
		}
		try {
			const gitInfo:Repo['gitInfo'] = await this.repoAnalyzer.getRepoBasicInfo(repoDir);
			const dockerInfo:Repo['dockerInfo'] = await this.repoAnalyzer.getRepoDockerInfo(repoDir);
			const languageInfo:Repo['languageInfo'] = await this.repoAnalyzer.getRepoLanguageInfo(repoDir);
			const repoInfo:Repo = {
				service: service ?? 'local',
				tokenId,
				gitInfo,
				dockerInfo,
				languageInfo,
			};
			const metadataPath = path.join(ReposController.gitSourcesPath, encodeURIComponent(repoUrl)+'.json');
			await fs.writeFile(metadataPath, JSON.stringify(repoInfo), {flag: 'w', encoding: 'utf-8'});
			return repoInfo;
		}catch(e){
			logger.log(LogType.Error, 'Something went wrong reading repository information');
			return null;
		}
	}

	public async listRepos():Promise<Repo[]> {
		logger.log(LogType.Info, 'Listing git repositories');
		try {
			const files = (await fs.readdir(ReposController.gitSourcesPath, {withFileTypes: true}))
				.filter(d => d.isFile());
			const repos:Repo[] = [];
			for(const file of files){
				const data = await fs.readFile(path.join(ReposController.gitSourcesPath, file.name), {encoding: 'utf-8'});
				const repoInfo:Repo = JSON.parse(data);
				repos.push(repoInfo);
			}
			return repos;
		}catch(e){
			logger.log(LogType.Error, 'Something went wrong while listing repositories');
			return [];
		}
	}

	public async getRepo(repoUrl:string):Promise<Repo | null> {
		const repos = await this.listRepos();
		return repos.find(r => r.gitInfo.remoteName.endsWith(repoUrl));
	}

	public async buildRepo(repoUrl:string, name:string, selectedFile:string, envVariables:Record<string, string>):Promise<string> {
		return await this.repoBuilder.buildRepo(repoUrl, name, selectedFile, envVariables);
	}
}
