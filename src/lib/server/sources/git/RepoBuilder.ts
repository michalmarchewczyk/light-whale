import {logger, LogType} from '$lib/server/utils/Logger';
import fs from 'fs/promises';
import path from 'path';
import {getContainerAndComposeNames} from '$lib/server/docker/containers';
import {getImagesNames} from '$lib/server/docker/images';
import {exec} from 'child_process';
import type {ComposeSpecification} from '$lib/server/typings/docker/ComposeFile';
import YAML from 'yaml';
import {LW_NETWORK_NAME} from '$lib/server/docker/config';
import type {Repo} from '$lib/server/sources/git/Repo.interface';

export default class RepoBuilder {
	constructor(private gitSourcesPath:string) {}

	public async buildRepo(repoUrl:string, name:string, selectedFile:string, envVariables:Record<string, string>):Promise<string>{
		await logger.log(LogType.Info, `Building repo: ${repoUrl}`);
		const data = await fs.readFile(path.join(this.gitSourcesPath, encodeURIComponent(repoUrl)+'.json'), {encoding: 'utf-8'});
		const repoInfo:Repo = JSON.parse(data);
		const file = repoInfo.dockerInfo.files.find(f => f.file === selectedFile);
		if(!file){
			return '';
		}
		if(file.envVars.join(' ') !== Object.keys(envVariables).join(' ')){
			return '';
		}
		const names = [...await getContainerAndComposeNames(), ...await getImagesNames()];
		if(names.includes(name)){
			return 'name';
		}
		if(selectedFile.includes('Dockerfile')){
			return await this.buildFromDockerfile(repoInfo, name, selectedFile);
		}else{
			await this.buildFromComposeFile(repoInfo, name, selectedFile, envVariables);
			return '';
		}
	}

	private async buildFromDockerfile(repoInfo:Repo, name:string, selectedFile:string):Promise<string>{
		await logger.log(LogType.Info, `Building image with name: ${name}`);
		const dockerfilePath = path.join(this.gitSourcesPath, encodeURIComponent(repoInfo.gitInfo.remoteName), selectedFile);
		const contextPath = path.join(this.gitSourcesPath, encodeURIComponent(repoInfo.gitInfo.remoteName));
		const imageId:string = await new Promise((resolve) => {
			exec(`docker build --quiet --tag ${name} --file ${dockerfilePath} ${contextPath}`, {env: {...process.env}}, (err, data) => {
				if(err){
					resolve('');
				}
				resolve(data);
			});
		});
		await logger.log(LogType.Info, `Built image with ID: ${imageId}`);
		return imageId;
	}

	private async buildFromComposeFile(repoInfo:Repo, name:string, selectedFile:string, envVariables:Record<string, string>):Promise<string>{
		await logger.log(LogType.Info, `Building app with name: ${name}`);
		const config:ComposeSpecification = YAML.parse(repoInfo.dockerInfo.files.find(file => file.file === selectedFile)?.content);
		Object.values(config.services).forEach((service) => {
			if(service.ports){
				service.ports = [];
			}
			if(!service.networks){
				service.networks = [];
			}
			if(Array.isArray(service.networks)){
				service.networks.push(LW_NETWORK_NAME);
			}else{
				service.networks[LW_NETWORK_NAME] = {};
			}
		});
		if(!config.networks){
			config.networks = {[LW_NETWORK_NAME]: {external: true}};
		}else{
			config.networks[LW_NETWORK_NAME] = {external: true};
		}

		const tempConfigPath = path.join(this.gitSourcesPath, encodeURIComponent(repoInfo.gitInfo.remoteName), selectedFile+'.temp');
		await fs.writeFile(tempConfigPath, YAML.stringify(config));
		await new Promise((resolve) => {
			exec(`docker compose -f ${tempConfigPath} -p ${name} up --no-start --build --force-recreate`, {env: {...process.env, ...envVariables}}, (err) => {
				if(err){
					resolve(false);
				}
				resolve(true);
			});
		});
		await fs.rm(tempConfigPath);
		return name;
	}
}
