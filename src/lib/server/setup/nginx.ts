import {connectToLWNetwork, inspectContainer, startContainer} from '$lib/server/docker/containers';
import {NGINX_CONTAINER_NAME} from '$lib/server/network/nginx';
import {getImages} from '$lib/server/docker/images';
import {checkNetwork} from '$lib/server/network/network';
import {DOCKER_URL, LW_NETWORK_NAME} from '$lib/server/docker/config';
import path from 'path';
import fs from 'fs/promises';
import defaultConfig from '$lib/server/network/default.conf?raw';
import {pingDocker} from '$lib/server/docker/ping';
import {logger, LogType} from '$lib/server/utils/Logger';

const nginxPath = process.env.NGINX_PATH ?? path.join(process.cwd(), 'nginx-config');
const configPath = path.join(process.cwd(), 'lw-config');
const tokensPath = path.join(process.cwd(), 'lw-config', 'tokens.txt');

export const checkNginx = async ():Promise<string> => {
	logger.log(LogType.Verbose, 'Checking NGINX setup');
	const ping = await pingDocker();
	if(!ping){
		logger.log(LogType.Error, 'NGINX setup check: Could not connect to Docker');
		return 'no-docker';
	}
	logger.log(LogType.Verbose, 'NGINX setup check: Connected to Docker');
	const container = await inspectContainer(NGINX_CONTAINER_NAME);
	if(!container['Id']){
		logger.log(LogType.Error, 'NGINX setup check: Could not find LW container');
		return 'no-container';
	}
	logger.log(LogType.Verbose, 'NGINX setup check: LW container exists');
	const images = await getImages();
	const image = images.find(i => i.id === container['Image']);
	if(!image?.digests[0].startsWith('nginx@')){
		return 'no-image';
	}
	const network = await checkNetwork();
	if(!network){
		logger.log(LogType.Error, 'NGINX setup check: LW container not connected to network');
		return 'no-network';
	}
	logger.log(LogType.Verbose, 'NGINX setup check: LW container connected to network');
	try {
		await fs.access(nginxPath);
		await fs.access(configPath);
	}catch(e){
		logger.log(LogType.Error, 'NGINX setup check: Config paths are not configured correctly');
		return 'no-folder';
	}
	logger.log(LogType.Verbose, 'NGINX setup check: Config paths correct');
	logger.log(LogType.Verbose, 'NGINX setup check: Done');
	return 'ok';
};


export const createNginxContainer = async():Promise<string> => {
	logger.log(LogType.Info, 'Starting NGINX Setup');
	logger.log(LogType.Info, 'NGINX Setup: Pulling latest NGINX image');
	const res = await fetch(DOCKER_URL + '/images/create?fromImage=nginx:latest', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
	});
	await res.text();
	if(res.status !== 200){
		logger.log(LogType.Error, 'NGINX Setup: Failed to pull NGINX image');
		return 'image';
	}
	logger.log(LogType.Info, 'NGINX Setup: Deleting existing LW containers');
	await fetch(DOCKER_URL + `/containers/${NGINX_CONTAINER_NAME}?force=true`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
	});
	logger.log(LogType.Info, 'NGINX Setup: Creating LW container');
	const res3 = await fetch(DOCKER_URL + `/containers/create?name=${NGINX_CONTAINER_NAME}`, {
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
	if(res3.status !== 201){
		logger.log(LogType.Error, 'NGINX Setup: Failed to create LW container');
		return 'container';
	}
	const container = await res3.json();
	const id = container?.['Id'] ?? '';
	logger.log(LogType.Info, 'NGINX Setup: Starting LW container');
	await startContainer(id);
	logger.log(LogType.Info, 'NGINX Setup: Creating LW network');
	const res4 = await fetch(DOCKER_URL + '/networks/create', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			Name: LW_NETWORK_NAME,
			CheckDuplicate: true,
			Attachable: true,
		})
	});
	if(res4.status !== 201 && res4.status !== 409){
		logger.log(LogType.Error, 'NGINX Setup: Failed to create LW network');
		return 'network';
	}
	logger.log(LogType.Info, 'NGINX Setup: Connecting LW container to network');
	const connect = await connectToLWNetwork(id);
	if(!connect){
		logger.log(LogType.Error, 'NGINX Setup: Failed to connect LW container to network');
		return 'connect';
	}
	logger.log(LogType.Info, 'NGINX Setup: Setting up config paths');
	await fs.mkdir(nginxPath).catch(() => '');
	await fs.mkdir(configPath).catch(() => '');
	await fs.writeFile(tokensPath, '', {encoding: 'utf-8'}).catch(() => '');
	await fs.writeFile(path.join(nginxPath, 'default.conf'), defaultConfig, {encoding: 'utf-8'});
	logger.log(LogType.Info, 'NGINX Setup: Done');
	return 'ok';
};
