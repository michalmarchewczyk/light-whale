import {getLastEvent} from '$lib/docker/events';
import type {EndpointOutput} from '@sveltejs/kit';

export async function get():Promise<EndpointOutput> {
	const event = await getLastEvent();
	return {
		status: 200,
		body: JSON.stringify(event),
	};
}
