import type FilesManager from '$lib/server/utils/FilesManager';
import type Repo from '$lib/server/sources/git/Repo';
import { logger } from '$lib/server/utils/Logger';

export interface File {
	directory: boolean;
	symlink: boolean;
	name: string;
	size: string;
	date: string;
}

export default class RepoFilesReader {
	constructor(private filesManager: FilesManager) {
		logger.logVerbose('RepoFilesReader initialized');
	}

	public async readPath(repo: Repo, filepath: string): Promise<File[] | string> {
		logger.logVerbose(`Reading path ${filepath} in repo ${repo.gitInfo.remoteUrl}`);
		const stat = await this.filesManager.getFileStat(
			`/sources/git/${encodeURIComponent(repo.gitInfo.remoteUrl)}/${filepath}`
		);
		if (stat.isFile()) {
			return await this.filesManager.readFile(
				`/sources/git/${encodeURIComponent(repo.gitInfo.remoteUrl)}/${filepath}`
			);
		}
		if (stat.isDirectory()) {
			const files = await this.filesManager.readDir(
				`/sources/git/${encodeURIComponent(repo.gitInfo.remoteUrl)}/${filepath}`
			);
			return Promise.all(
				files.map(async (file) => {
					const stat = await this.filesManager.getFileStat(
						`/sources/git/${encodeURIComponent(repo.gitInfo.remoteUrl)}/${filepath}/${file}`
					);
					return {
						directory: stat.isDirectory(),
						symlink: stat.isSymbolicLink(),
						name: file,
						size: stat.size.toString(),
						date: stat.mtime.toISOString()
					};
				})
			);
		}
		return [];
	}
}
