import {inspectContainer} from '$lib/docker/containers';
import {execCommand} from '$lib/docker/exec';

export const NGINX_CONTAINER_NAME = process.env.NGINX_CONTAINER_NAME ?? 'light-whale-nginx';

export const checkContainer = async ():Promise<boolean> => {
	const container = await inspectContainer(NGINX_CONTAINER_NAME);
	return container?.['State']?.['Status'] === 'running';
};

export const reloadNginx = async ():Promise<boolean> => {
	const container = await inspectContainer(NGINX_CONTAINER_NAME);
	if(!container['Id'] || container?.['State']?.['Status'] !== 'running'){
		return false;
	}
	await execCommand(container['Id'], 'nginx -s reload');
};
