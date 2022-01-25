import {inspectContainer} from '$lib/docker/containers';
import {execCommand} from '$lib/docker/exec';
import {LW_NETWORK_NAME} from '$lib/docker/config';

export const NGINX_CONTAINER_NAME = process.env.NGINX_CONTAINER_NAME ?? 'light-whale-nginx';

export const checkContainer = async ():Promise<boolean> => {
	const container = await inspectContainer(NGINX_CONTAINER_NAME);
	return container?.['State']?.['Status'] === 'running';
};

export const checkContainerConnected = async ():Promise<boolean> => {
	const container = await inspectContainer(NGINX_CONTAINER_NAME);
	return Object.keys(container?.['NetworkSettings']?.['Networks']).includes(LW_NETWORK_NAME);
};

export const reloadNginx = async ():Promise<boolean> => {
	const container = await inspectContainer(NGINX_CONTAINER_NAME);
	if (!container['Id'] || container?.['State']?.['Status'] !== 'running') {
		return false;
	}
	await execCommand(container['Id'], 'nginx -s reload');
	return true;
};
