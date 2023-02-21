import type FilesManager from '$lib/server/utils/FilesManager';
import type Repo from '$lib/server/sources/git/Repo';
import YAML from 'yaml';
import { exec } from 'child_process';
import type { ComposeSpecification } from '$lib/server/types/docker/ComposeFile';
import { LW_NETWORK_NAME } from '$lib/server/config';
import { logger } from '$lib/server/utils/Logger';

export default class RepoBuilder {
	constructor(private filesManager: FilesManager) {
		logger.logVerbose('RepoBuilder initialized');
	}

	public async buildRepo(
		repo: Repo,
		name: string,
		selectedFile: string,
		envVariables: Record<string, string>
	) {
		logger.logInfo(
			`Building repo ${repo.gitInfo.remoteUrl} with name ${name} from file ${selectedFile}`
		);
		const file = repo.dockerInfo.files.find((f) => f.file === selectedFile);
		if (!file) {
			return '';
		}
		if (selectedFile.includes('Dockerfile')) {
			return await this.buildFromDockerfile(repo, name, selectedFile);
		} else {
			await this.buildFromComposeFile(repo, name, selectedFile, envVariables);
			return '';
		}
	}

	private async buildFromDockerfile(
		repoInfo: Repo,
		name: string,
		selectedFile: string
	): Promise<string> {
		logger.logInfo(`Building from Dockerfile ${selectedFile}`);
		const dockerfilePath = await this.filesManager.getAbsPath(
			`sources/git/${encodeURIComponent(repoInfo.gitInfo.remoteUrl)}/${selectedFile}`
		);
		const contextPath = await this.filesManager.getAbsPath(
			`sources/git/${encodeURIComponent(repoInfo.gitInfo.remoteUrl)}`
		);
		return await new Promise((resolve) => {
			exec(
				`docker build --quiet --tag ${name} --file ${dockerfilePath} ${contextPath}`,
				{ env: { ...process.env } },
				(err, data) => {
					if (err) {
						logger.logError(`Error building repo ${repoInfo.gitInfo.remoteUrl}`);
						resolve('');
					}
					logger.logInfo(`Built repo ${repoInfo.gitInfo.remoteUrl} with name ${name}`);
					resolve(data);
				}
			);
		});
	}

	private async buildFromComposeFile(
		repoInfo: Repo,
		name: string,
		selectedFile: string,
		envVariables: Record<string, string>
	): Promise<string> {
		logger.logInfo(`Building from compose file ${selectedFile}`);
		const config: ComposeSpecification = YAML.parse(
			repoInfo.dockerInfo.files.find((file) => file.file === selectedFile)?.content ?? ''
		);
		Object.values(config.services ?? {}).forEach((service) => {
			if (service.ports) {
				service.ports = [];
			}
			if (!service.networks) {
				service.networks = [];
			}
			if (Array.isArray(service.networks)) {
				service.networks.push(LW_NETWORK_NAME);
			} else {
				service.networks[LW_NETWORK_NAME] = {};
			}
		});
		if (!config.networks) {
			config.networks = { [LW_NETWORK_NAME]: { external: true } };
		} else {
			config.networks[LW_NETWORK_NAME] = { external: true };
		}
		await this.filesManager.writeFile(
			`sources/git/${encodeURIComponent(repoInfo.gitInfo.remoteUrl)}/${selectedFile}.temp`,
			YAML.stringify(config),
			true
		);
		const tempConfigPath = await this.filesManager.getAbsPath(
			`sources/git/${encodeURIComponent(repoInfo.gitInfo.remoteUrl)}/${selectedFile}.temp`
		);
		await new Promise((resolve) => {
			exec(
				`docker compose -f ${tempConfigPath} -p ${name} up --no-start --build --force-recreate`,
				{ env: { ...process.env, ...envVariables } },
				(err) => {
					if (err) {
						logger.logError(`Error building repo ${repoInfo.gitInfo.remoteUrl}`);
						resolve(false);
					}
					logger.logInfo(`Built repo ${repoInfo.gitInfo.remoteUrl} with name ${name}`);
					resolve(true);
				}
			);
		});
		return name;
	}
}
