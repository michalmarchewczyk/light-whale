import type FilesManager from '$lib/server/utils/FilesManager';
import type Repo from '$lib/server/sources/git/Repo';
import YAML from 'yaml';
import { spawn } from 'child_process';
import type { ComposeSpecification } from '$lib/server/types/docker/ComposeFile';
import { LW_NETWORK_NAME } from '$lib/server/config';
import { logger } from '$lib/server/utils/Logger';
import type ProcessesManager from '$lib/server/processes/ProcessesManager';

export default class RepoBuilder {
	constructor(private filesManager: FilesManager, private processesManager: ProcessesManager) {
		logger.logVerbose('RepoBuilder initialized');
	}

	public async buildRepo(
		repo: Repo,
		name: string,
		selectedFile: string,
		envVariables: Record<string, string>,
		autoRestart: boolean
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
			return await this.buildFromComposeFile(repo, name, selectedFile, envVariables, autoRestart);
		}
	}

	private async buildFromDockerfile(
		repoInfo: Repo,
		name: string,
		selectedFile: string
	): Promise<string> {
		logger.logInfo(`Building from Dockerfile ${selectedFile}`);
		const process = await this.processesManager.createNewProcess(`Building Dockerfile: ${name}`);
		const dockerfilePath = await this.filesManager.getAbsPath(
			`sources/git/${encodeURIComponent(repoInfo.gitInfo.remoteUrl)}/${selectedFile}`
		);
		const contextPath = await this.filesManager.getAbsPath(
			`sources/git/${encodeURIComponent(repoInfo.gitInfo.remoteUrl)}`
		);
		const spawnProcess = spawn(
			'docker',
			`build --tag ${name} --file ${dockerfilePath} ${contextPath}`.split(' ')
		);
		spawnProcess.stderr.on('data', async (data) => {
			await this.processesManager.updateProcess(process.id, 'running', data.toString());
		});
		spawnProcess.stdout.on('data', async (data) => {
			await this.processesManager.updateProcess(process.id, 'running', data.toString());
		});
		spawnProcess.stdout.on('close', async () => {
			logger.logInfo(`Built repo ${repoInfo.gitInfo.remoteUrl} with name ${name}`);
			await this.processesManager.updateProcess(process.id, 'done', '');
		});
		spawnProcess.on('error', async (err) => {
			logger.logError(`Error building repo ${repoInfo.gitInfo.remoteUrl}`);
			await this.processesManager.updateProcess(process.id, 'error', err.toString());
		});
		return name;
	}

	private async buildFromComposeFile(
		repoInfo: Repo,
		name: string,
		selectedFile: string,
		envVariables: Record<string, string>,
		autoRestart: boolean
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
			if (autoRestart) {
				service.restart = 'always';
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
		const buildProcess = await this.processesManager.createNewProcess(
			`Building Compose App: ${name}`
		);
		const tempConfigPath = await this.filesManager.getAbsPath(
			`sources/git/${encodeURIComponent(repoInfo.gitInfo.remoteUrl)}/${selectedFile}.temp`
		);
		const spawnProcess = spawn(
			'docker',
			`compose -f ${tempConfigPath} -p ${name} up --no-start --build --force-recreate`.split(' '),
			{ env: { ...process.env, ...envVariables } }
		);
		spawnProcess.stderr.on('data', async (data) => {
			await this.processesManager.updateProcess(buildProcess.id, 'running', data.toString());
		});
		spawnProcess.stdout.on('data', async (data) => {
			await this.processesManager.updateProcess(buildProcess.id, 'running', data.toString());
		});
		spawnProcess.stdout.on('close', async () => {
			logger.logInfo(`Built repo ${repoInfo.gitInfo.remoteUrl} with name ${name}`);
			await this.processesManager.updateProcess(buildProcess.id, 'done', '');
		});
		spawnProcess.on('error', async (err) => {
			logger.logError(`Error building repo ${repoInfo.gitInfo.remoteUrl}`);
			await this.processesManager.updateProcess(buildProcess.id, 'error', err.toString());
		});
		return name;
	}
}
