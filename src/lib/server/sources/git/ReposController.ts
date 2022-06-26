import fs from 'fs/promises';
import path from 'path';
import {logger, LogType} from '$lib/server/utils/Logger';
import type {SimpleGit} from 'simple-git';
import simpleGit from 'simple-git';
import RepoAnalyzer from '$lib/server/sources/git/RepoAnalyzer';
import type {Repo} from '$lib/server/sources/git/Repo.interface';
import RepoBuilder from '$lib/server/sources/git/RepoBuilder';

class ReposController {
	private static instance: ReposController;
	private static gitSourcesPath = path.join(process.cwd(), 'git-sources');

	private constructor(private git:SimpleGit, private repoAnalyzer:RepoAnalyzer, private repoBuilder:RepoBuilder) {}

	public static getInstance(): ReposController {
		if (!ReposController.instance) {
			const git = simpleGit({
				binary: 'git'
			});
			ReposController.instance = new ReposController(git, new RepoAnalyzer(git), new RepoBuilder(ReposController.gitSourcesPath));
		}
		return ReposController.instance;
	}

	private async pullRepo(repoUrl:string, repoDir:string) {
		try {
			await fs.access(repoDir);
			logger.log(LogType.Info, `Pulling git repository ${repoUrl}`);
			await this.git.cwd({path: repoDir}).pull();
			return true;
		} catch (e) {
			try {
				logger.log(LogType.Info, `Fetching git repository ${repoUrl}`);
				await this.git.cwd({path: ReposController.gitSourcesPath}).clone(repoUrl, repoDir);
				return true;
			} catch (e) {
				logger.log(LogType.Error, `Could not fetch git repository ${repoUrl}`);
				return false;
			}
		}
	}

	public async fetchRepo(repoUrl:string) {
		const repoDir = path.join(ReposController.gitSourcesPath, encodeURIComponent(repoUrl));
		const pulled = await this.pullRepo(repoUrl, repoDir);
		if(!pulled){
			return null;
		}
		try {
			const gitInfo:Repo['gitInfo'] = await this.repoAnalyzer.getRepoBasicInfo(repoDir);
			const dockerInfo:Repo['dockerInfo'] = await this.repoAnalyzer.getRepoDockerInfo(repoDir);
			const languageInfo:Repo['languageInfo'] = await this.repoAnalyzer.getRepoLanguageInfo(repoDir);
			const repoInfo:Repo = {
				service: 'local',
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

	public async buildRepo(repoUrl:string, name:string, selectedFile:string, envVariables:Record<string, string>):Promise<string> {
		return await this.repoBuilder.buildRepo(repoUrl, name, selectedFile, envVariables);
	}
}

export const reposController = ReposController.getInstance();

export default ReposController;
