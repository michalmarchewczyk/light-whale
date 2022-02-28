import {connectToLWNetwork, inspectContainer, startContainer} from '$lib/docker/containers';
import {NGINX_CONTAINER_NAME} from '$lib/network/nginx';
import {getImages} from '$lib/docker/images';
import {checkNetwork} from '$lib/network/network';
import {DOCKER_URL, LW_NETWORK_NAME} from '$lib/docker/config';
import path from 'path';
import fs from 'fs/promises';
import defaultConfig from '$lib/network/default.conf?raw';
import {pingDocker} from '$lib/docker/ping';

const nginxPath = process.env.NGINX_PATH ?? path.join(process.cwd(), 'nginx-config');
const configPath = path.join(process.cwd(), 'lw-config');
const logsPath = path.join(process.cwd(), 'lw-logs');

export const checkNginx = async ():Promise<string> => {
	const ping = await pingDocker();
	if(!ping){
		return 'no-docker';
	}
	const container = await inspectContainer(NGINX_CONTAINER_NAME);
	if(!container['Id']){
		return 'no-container';
	}
	const images = await getImages();
	const image = images.find(i => i.id === container['Image']);
	if(!image?.digests[0].startsWith('nginx@')){
		return 'no-image';
	}
	const network = await checkNetwork();
	if(!network){
		return 'no-network';
	}
	try {
		await fs.access(nginxPath);
		await fs.access(configPath);
	}catch(e){
		return 'no-folder';
	}
	return 'ok';
};


export const createNginxContainer = async():Promise<string> => {
	const res = await fetch(DOCKER_URL + '/images/create?fromImage=nginx:latest', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
	});
	await res.text();
	if(res.status !== 200){
		return 'image';
	}
	await fetch(DOCKER_URL + `/containers/${NGINX_CONTAINER_NAME}?force=true`, {
		method: 'DELETE',
		headers: {'Content-Type': 'application/json'},
	});
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
		return 'container';
	}
	const container = await res3.json();
	const id = container?.['Id'] ?? '';
	await startContainer(id);
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
		return 'network';
	}
	const connect = await connectToLWNetwork(id);
	if(!connect){
		return 'connect';
	}
	await fs.mkdir(nginxPath).catch(() => '');
	await fs.mkdir(configPath).catch(() => '');
	await fs.mkdir(logsPath).catch(() => '');
	await fs.writeFile(path.join(nginxPath, 'default.conf'), defaultConfig, {encoding: 'utf-8'});
	return 'ok';
};
