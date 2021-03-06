import {logger, LogType} from '$lib/server/utils/Logger';
import {DOCKER_URL, LW_NETWORK_NAME} from '$lib/server/docker/config';
import fs from 'fs/promises';
import path from 'path';
import defaultConfig from '$lib/server/network/templates/default.conf?raw';
import {configPath, NGINX_CONTAINER_NAME, nginxPath} from '$lib/server/setup/config';
import {containersController, imagesController} from '$lib/server/docker';

export default class SetupNginxController {
	private containerId:string|null = null;

	public async setup():Promise<boolean> {
		logger.log(LogType.Info, 'Starting NGINX Setup');
		const pulledImage = await this.pullImage();
		if(!pulledImage){
			return false;
		}
		await this.deleteExistingContainers();
		const createdContainer = await this.createContainer();
		if(!createdContainer){
			return false;
		}
		const createdNetwork = await this.createNetwork();
		if(!createdNetwork){
			return false;
		}
		const connectedToNetwork = await this.connectToNetwork();
		if(!connectedToNetwork){
			return false;
		}
		const setupPaths = await this.setupPaths();
		if(!setupPaths){
			return false;
		}
		logger.log(LogType.Info, 'NGINX Setup: Done');
		return true;
	}

	private async deleteExistingContainers() {
		logger.log(LogType.Info, 'NGINX Setup: Deleting existing LW containers');
		await fetch(DOCKER_URL + `/containers/${NGINX_CONTAINER_NAME}?force=true`, {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
		});
	}

	private async pullImage():Promise<boolean> {
		logger.log(LogType.Info, 'NGINX Setup: Pulling latest NGINX image');
		const pulledImage = await imagesController.pullImage('nginx', 'latest');
		if(!pulledImage){
			logger.log(LogType.Error, 'NGINX Setup: Failed to pull NGINX image');
			return false;
		}
		return true;
	}

	private async createContainer():Promise<boolean> {
		logger.log(LogType.Info, 'NGINX Setup: Creating LW container');
		const res = await fetch(DOCKER_URL + `/containers/create?name=${NGINX_CONTAINER_NAME}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				Image: 'nginx:latest',
				HostConfig: {
					Binds: [`${nginxPath}:/etc/nginx/conf.d`],
					PortBindings: {
						'80/tcp': [{'HostPort': '80'}],
					},
					RestartPolicy: {
						Name: 'always',
					}
				},
			})
		});
		if(res.status !== 201){
			logger.log(LogType.Error, 'NGINX Setup: Failed to create LW container');
			return false;
		}
		const container = await res.json();
		this.containerId = container?.['Id'] ?? '';
		logger.log(LogType.Info, 'NGINX Setup: Starting LW container');
		const createdContainer = await containersController.getContainer(this.containerId);
		await createdContainer.start();
		return true;
	}

	private async createNetwork():Promise<boolean> {
		logger.log(LogType.Info, 'NGINX Setup: Creating LW network');
		const res = await fetch(DOCKER_URL + '/networks/create', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				Name: LW_NETWORK_NAME,
				CheckDuplicate: true,
				Attachable: true,
			})
		});
		if(res.status !== 201 && res.status !== 409){
			logger.log(LogType.Error, 'NGINX Setup: Failed to create LW network');
			return false;
		}
		return true;
	}

	private async connectToNetwork():Promise<boolean> {
		logger.log(LogType.Info, 'NGINX Setup: Connecting LW container to network');
		const container = await containersController.getContainer(this.containerId);
		const connect = await container?.connectToLWNetwork();
		if(!connect){
			logger.log(LogType.Error, 'NGINX Setup: Failed to connect LW container to network');
			return false;
		}
		return true;
	}

	private async setupPaths():Promise<boolean> {
		logger.log(LogType.Info, 'NGINX Setup: Setting up config paths');
		await fs.mkdir(nginxPath, {recursive: true}).catch(() => '');
		await fs.mkdir(configPath, {recursive: true}).catch(() => '');
		await fs.writeFile(path.join(nginxPath, 'default.conf'), defaultConfig, {encoding: 'utf-8', flag:'w'});
		return true;
	}
}
