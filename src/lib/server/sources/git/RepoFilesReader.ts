import {logger, LogType} from '$lib/server/utils/Logger';
import type {File} from '$lib/server/sources/git/File.interface';
import type {Repo} from '$lib/server/sources/git/Repo.interface';
import fs from 'fs/promises';
import ReposController from '$lib/server/sources/git/ReposController';
import path from 'path';

export default class RepoFilesReader {
	private async getRepoFiles(repo: Repo, dirPath:string): Promise<File[]> {
		logger.log(LogType.Info, `Read folder: ${dirPath} from repo: ${new URL(repo.gitInfo.remoteName).pathname}`);
		const pathToRead = path.join(ReposController.gitSourcesPath, encodeURIComponent(repo.gitInfo.remoteName), dirPath);
		const files = await fs.readdir(pathToRead, {withFileTypes: true});
		const res:File[] = [];
		for(const file of files) {
			const stat = await fs.stat(`${pathToRead}/${file.name}`);
			res.push({
				directory: file.isDirectory(),
				symlink: file.isSymbolicLink(),
				name: file.name,
				size: stat.size,
				date: new Date(stat.mtimeMs),
			});
		}
		return res;
	}

	private async readRepoFile(repo: Repo, filePath:string):Promise<string> {
		logger.log(LogType.Info, `Read file: ${path} from repo: ${new URL(repo.gitInfo.remoteName).pathname}`);
		const pathToRead = path.join(ReposController.gitSourcesPath, encodeURIComponent(repo.gitInfo.remoteName), filePath);
		return await fs.readFile(pathToRead, {encoding: 'utf-8'});
	}

	public async readPath(repo:Repo, filePath:string):Promise<File[] | string> {
		logger.log(LogType.Info, `Read path: ${filePath} from repo: ${new URL(repo.gitInfo.remoteName).pathname}`);
		const pathToRead = path.join(ReposController.gitSourcesPath, encodeURIComponent(repo.gitInfo.remoteName), filePath);
		const stat = await fs.stat(pathToRead);
		if (stat.isFile()) {
			return await this.readRepoFile(repo, filePath);
		}
		return await this.getRepoFiles(repo, filePath);
	}
}
