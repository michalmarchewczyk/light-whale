import {logger, LogType} from '$lib/server/utils/Logger';
import {inspectContainer} from '$lib/server/docker/containers';
import {getImages} from '$lib/server/docker/images';
import {DOCKER_URL, LW_NETWORK_NAME} from '$lib/server/docker/config';
import fs from 'fs/promises';
import path from 'path';
import type {SetupError} from '$lib/server/setup/SetupController';
import {NGINX_CONTAINER_NAME} from '$lib/server/network/nginxConfig';

const nginxPath = process.env.NGINX_PATH ?? path.join(process.cwd(), 'nginx-config');
const configPath = path.join(process.cwd(), 'lw-config');

class SetupNginxChecker {
	public async check():Promise<SetupError[]> {
		logger.log(LogType.Verbose, 'Checking NGINX setup');
		const errors:SetupError[] = [];
		if(!await this.checkContainer()) {
			errors.push('no-container');
		}
		if(!await this.checkImage()) {
			errors.push('no-image');
		}
		if(!await this.checkNetwork()) {
			errors.push('no-network');
		}
		if(!await this.checkPaths()) {
			errors.push('no-paths');
		}
		return errors;
	}

	private async checkContainer():Promise<boolean>{
		const container = await inspectContainer(NGINX_CONTAINER_NAME);
		if(!container['Id']){
			logger.log(LogType.Error, 'NGINX setup check: Could not find LW container');
			return false;
		}
		logger.log(LogType.Verbose, 'NGINX setup check: LW container exists');
		return true;
	}

	private async checkImage():Promise<boolean> {
		const container = await inspectContainer(NGINX_CONTAINER_NAME);
		const images = await getImages();
		const image = images.find(i => i.id === container?.['Image']);
		return image?.digests[0].startsWith('nginx@');
	}

	private async checkNetwork():Promise<boolean> {
		logger.log(LogType.Verbose, 'Checking LW network');
		try {
			const res = await fetch(DOCKER_URL+`/networks/${LW_NETWORK_NAME}`);
			return res.status === 200;
		}catch (e) {
			return false;
		}
	}

	private async checkPaths():Promise<boolean> {
		try {
			await fs.access(nginxPath);
			await fs.access(configPath);
			return true;
		}catch(e){
			logger.log(LogType.Error, 'NGINX setup check: Config paths are not configured correctly');
			return false;
		}
	}

}

export default SetupNginxChecker;
