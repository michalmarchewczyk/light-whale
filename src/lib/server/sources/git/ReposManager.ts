import type { SimpleGit } from 'simple-git';
import type FilesManager from '$lib/server/utils/FilesManager';
import type Repo from '$lib/server/sources/git/Repo';
import type TokensManager from '$lib/server/auth/tokens/TokensManager';
import type RepoAnalyzer from '$lib/server/sources/git/RepoAnalyzer';
import { logger } from '$lib/server/utils/Logger';

export default class ReposManager {
	constructor(
		private git: SimpleGit,
		private filesManager: FilesManager,
		private tokensManager: TokensManager,
		private repoAnalyzer: RepoAnalyzer
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
				return true;
			} else {
				await this.git
					.cwd({ path: absPath })
					.init()
					.pull(pullUrl, defaultBranch)
					.addRemote('origin', remoteUrl);
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
		const repoDir = `sources/git/${encodeURIComponent(remoteUrl)}`;
		let pullUrl = remoteUrl;
		if (tokenId) {
			const token = this.tokensManager.getTokenById(tokenId);
			const url = new URL(remoteUrl);
			url.username = token?.token ?? '';
			pullUrl = url.href;
		}
		const pulled = await this.pullRepo(remoteUrl, pullUrl, repoDir, defaultBranch ?? 'master');
		if (!pulled) {
			return null;
		}
		try {
			const absPath = await this.filesManager.getAbsPath(repoDir);
			const gitInfo = await this.repoAnalyzer.getRepoGitInfo(absPath);
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
				JSON.stringify(repoInfo)
			);
			return repoInfo;
		} catch (e) {
			return null;
		}
	}
}
