import type { SimpleGit } from 'simple-git';
import { CheckRepoActions } from 'simple-git';
import type FilesManager from '$lib/server/utils/FilesManager';
import type Repo from '$lib/server/sources/git/Repo';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type RepoAnalyzer from '$lib/server/sources/git/RepoAnalyzer';
import { logger } from '$lib/server/utils/Logger';
import type GitServicesController from '$lib/server/sources/git/GitServicesController';
import { eventsController } from '$lib/server/events/EventsController';

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

	private async getPullUrl(remoteUrl: string, tokenId?: string) {
		let pullUrl = remoteUrl;
		if (tokenId) {
			const [token, serviceToken] = await Promise.all([
				this.tokensManager.getTokenById(tokenId),
				this.gitServicesController.getTokenById(tokenId)
			]);
			const url = new URL(remoteUrl);
			url.username = serviceToken?.login ?? '';
			url.password = token?.token ?? '';
			if (serviceToken?.login && token?.token.startsWith(serviceToken.login + ':')) {
				url.password = token?.token.split(':')[1] ?? '';
			}
			pullUrl = url.href;
		}
		return pullUrl;
	}

	private async getRepoDirPath(remoteUrl: string) {
		const repoDir = `sources/git/${encodeURIComponent(remoteUrl)}`;
		await this.filesManager.readDir(repoDir);
		return await this.filesManager.getAbsPath(repoDir);
	}

	private async pullUrl(
		remoteUrl: string,
		pullUrl: string,
		repoDirPath: string,
		defaultBranch: string
	) {
		const isRepo = await this.git
			.cwd({ path: repoDirPath })
			.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);
		try {
			if (isRepo) {
				await this.git.cwd({ path: repoDirPath }).pull(pullUrl, defaultBranch);
				await this.git.cwd({ path: repoDirPath }).submoduleUpdate();
				return true;
			} else {
				await this.git
					.cwd({ path: repoDirPath })
					.init()
					.pull(pullUrl, defaultBranch)
					.addRemote('origin', remoteUrl);
				await this.git.cwd({ path: repoDirPath }).submoduleInit().submoduleUpdate();
				return true;
			}
		} catch (e) {
			return false;
		}
	}

	private async saveRepo(
		remoteUrl: string,
		repoDirPath: string,
		service?: string,
		tokenId?: string
	): Promise<Repo> {
		logger.logInfo(`Analyzing repo ${remoteUrl}`);
		const gitInfo = await this.repoAnalyzer.getRepoGitInfo(repoDirPath);
		if (!gitInfo.remoteUrl) {
			gitInfo.remoteUrl = remoteUrl;
		}
		if (tokenId) {
			gitInfo.tokenId = tokenId;
		}
		const dockerInfo = await this.repoAnalyzer.getRepoDockerInfo(repoDirPath);
		const languageInfo = await this.repoAnalyzer.getRepoLanguageInfo(repoDirPath);
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
	}

	public async downloadRepo(
		remoteUrl: string,
		defaultBranch?: string,
		tokenId?: string,
		service?: string
	): Promise<Repo | null> {
		logger.logInfo(`Downloading repo ${remoteUrl}`);
		eventsController.pushInfo('Downloading repo', `Downloading repo ${remoteUrl}`);
		const repoDirPath = await this.getRepoDirPath(remoteUrl);
		const pullUrl = await this.getPullUrl(remoteUrl, tokenId);
		const pulled = await this.pullUrl(remoteUrl, pullUrl, repoDirPath, defaultBranch ?? 'master');
		if (!pulled) {
			logger.logError(`Failed to pull repo ${remoteUrl}`);
			eventsController.pushError('Failed to pull repo', `Failed to pull repo ${remoteUrl}`);
			return null;
		}
		try {
			const repoInfo = await this.saveRepo(remoteUrl, repoDirPath, service, tokenId);
			eventsController.pushSuccess('Repo downloaded', `Repo ${remoteUrl} downloaded`);
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

	public async getRepoCommits(repo: Repo) {
		const absPath = await this.getRepoDirPath(repo.gitInfo.remoteUrl);
		const commits = await this.git.cwd({ path: absPath }).log({
			maxCount: 500,
			format: {
				hash: '%h',
				message: '%s',
				authorName: '%aN',
				authorEmail: '%aE',
				date: '%aI'
			}
		});
		return commits.all.map((commit) => ({ ...commit }));
	}

	public async checkNewCommits(repo: Repo) {
		const absPath = await this.getRepoDirPath(repo.gitInfo.remoteUrl);
		const pullUrl = await this.getPullUrl(repo.gitInfo.remoteUrl, repo.gitInfo.tokenId);
		const commits = await this.git
			.cwd({ path: absPath })
			.fetch(pullUrl)
			.log({
				maxCount: 500,
				from: repo.gitInfo.branchName,
				to: 'origin/' + repo.gitInfo.branchName,
				format: {
					hash: '%h'
				}
			});
		return commits.all.map((commit) => ({ ...commit }));
	}

	public async pullRepo(repo: Repo) {
		logger.logInfo(`Pulling repo ${repo.gitInfo.remoteUrl}`);
		eventsController.pushInfo('Pulling repo', `Pulling repo ${repo.gitInfo.remoteUrl}`);
		const absPath = await this.getRepoDirPath(repo.gitInfo.remoteUrl);
		const pullUrl = await this.getPullUrl(repo.gitInfo.remoteUrl, repo.gitInfo.tokenId);
		await this.git.cwd({ path: absPath }).pull(pullUrl, repo.gitInfo.branchName);
		await this.saveRepo(repo.gitInfo.remoteUrl, absPath, repo.service, repo.gitInfo.tokenId);
		eventsController.pushSuccess('Repo pulled', `Repo ${repo.gitInfo.remoteUrl} pulled`);
	}
}
