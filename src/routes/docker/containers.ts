import type {EndpointOutput} from '@sveltejs/kit';
import {getContainers} from '$lib/docker/containers';

export async function get():Promise<EndpointOutput> {
	const containers = await getContainers();
	return {
		status: 200,
		body: JSON.stringify(containers)
	};
}
