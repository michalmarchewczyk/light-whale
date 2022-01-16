import {inspectContainer} from '$lib/docker/containers';

export const NGINX_CONTAINER_NAME = process.env.NGINX_CONTAINER_NAME ?? 'docker-control-panel-nginx';

export const checkContainer = async ():Promise<boolean> => {
	const container = await inspectContainer(NGINX_CONTAINER_NAME);
	return container['State']?.['Status'] === 'running';
};
