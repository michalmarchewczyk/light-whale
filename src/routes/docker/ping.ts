import type {EndpointOutput} from '@sveltejs/kit';
import {pingDocker} from '$lib/docker/ping';

export async function get():Promise<EndpointOutput> {
	const ping = await pingDocker();
	return {
		status: 200,
		body: ping.toString(),
	};
}
