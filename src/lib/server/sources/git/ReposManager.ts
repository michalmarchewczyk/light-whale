import type { SimpleGit } from 'simple-git';
import type FilesManager from '$lib/server/utils/FilesManager';
import type Repo from '$lib/server/sources/git/Repo';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type RepoAnalyzer from '$lib/server/sources/git/RepoAnalyzer';
import { logger } from '$lib/server/utils/Logger';
import type GitServicesController from '$lib/server/sources/git/GitServicesController';

export default class ReposManager {
	constructor(
		private git: SimpleGit,
		private filesManager: FilesManager,
		private tokensManager: TokensManager,
		private repoAnalyzer: RepoAnalyzer,
		private gitServicesController: GitServicesController
	) {
		this.filesManager.readDir('sources/git/').then(() => {
			logger.logVerbose('ReposManager initialized');
		});
	}

	private async pullRepo(
		remoteUrl: string,
		pullUrl: string,
		repoDir: string,
		defaultBranch: string
	) {
		const files = await this.filesManager.readDir(repoDir);
		const absPath = await this.filesManager.getAbsPath(repoDir);
		try {
			if (files.length > 0) {
				await this.git.cwd({ path: absPath }).pull(pullUrl, defaultBranch);
				await this.git.cwd({ path: absPath }).submoduleUpdate();
				return true;
			} else {
				await this.git
					.cwd({ path: absPath })
					.init()
					.pull(pullUrl, defaultBranch)
					.addRemote('origin', remoteUrl);
				await this.git.cwd({ path: absPath }).submoduleInit().submoduleUpdate();
				return true;
			}
		} catch (e) {
			return false;
		}
	}

	public async downloadRepo(
		remoteUrl: string,
		defaultBranch?: string,
		tokenId?: string,
		service?: string
	): Promise<Repo | null> {
		logger.logInfo(`Downloading repo ${remoteUrl}`);
		const repoDir = `sources/git/${encodeURIComponent(remoteUrl)}`;
		let pullUrl = remoteUrl;
		if (tokenId) {
			const token = this.tokensManager.getTokenById(tokenId);
			const serviceToken = await this.gitServicesController.getTokenById(tokenId);
			const url = new URL(remoteUrl);
			url.username = serviceToken?.login ?? '';
			url.password = token?.token ?? '';
			if (serviceToken?.login && token?.token.startsWith(serviceToken.login + ':')) {
				url.password = token?.token.split(':')[1] ?? '';
			}
			pullUrl = url.href;
		}
		const pulled = await this.pullRepo(remoteUrl, pullUrl, repoDir, defaultBranch ?? 'master');
		if (!pulled) {
			logger.logError(`Failed to pull repo ${remoteUrl}`);
			return null;
		}
		try {
			logger.logInfo(`Analyzing repo ${remoteUrl}`);
			const absPath = await this.filesManager.getAbsPath(repoDir);
			const gitInfo = await this.repoAnalyzer.getRepoGitInfo(absPath);
			if (!gitInfo.remoteUrl) {
				gitInfo.remoteUrl = remoteUrl;
			}
			const dockerInfo = await this.repoAnalyzer.getRepoDockerInfo(absPath);
			const languageInfo = await this.repoAnalyzer.getRepoLanguageInfo(absPath);
			const repoInfo: Repo = {
				service: service ?? 'local',
				gitInfo,
				dockerInfo,
				languageInfo
			};
			await this.filesManager.writeFile(
				`sources/git/${encodeURIComponent(remoteUrl)}.json`,
				JSON.stringify(repoInfo),
				true
			);
			return repoInfo;
		} catch (e) {
			logger.logError(`Failed to analyze repo ${remoteUrl}`);
			return null;
		}
	}

	public async listRepos(): Promise<Repo[]> {
		logger.logVerbose('Listing local repos');
		const files = await this.filesManager.readDirFiles('sources/git/');
		const repos: Repo[] = [];
		for (const file of files) {
			try {
				const repoInfo: Repo = JSON.parse(file);
				repos.push(repoInfo);
			} catch (e) {
				// ignore
			}
		}
		return repos;
	}

	public async getRepoByUrl(url: string): Promise<Repo | null> {
		const repos = await this.listRepos();
		return repos.find((repo) => repo.gitInfo.remoteUrl === url) ?? null;
	}
}
