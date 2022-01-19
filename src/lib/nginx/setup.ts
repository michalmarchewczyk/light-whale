import {inspectContainer} from '$lib/docker/containers';

export const NGINX_CONTAINER_NAME = process.env.NGINX_CONTAINER_NAME ?? 'light-whale-nginx';

export const checkContainer = async ():Promise<boolean> => {
	const container = await inspectContainer(NGINX_CONTAINER_NAME);
	return container['State']?.['Status'] === 'running';
};
