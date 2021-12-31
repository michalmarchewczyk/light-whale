import {getLastEvent} from '$lib/docker/events';
import type {RequestHandler} from '@sveltejs/kit';

const get:RequestHandler<Promise<void>, void> = async () => {
	const event = await getLastEvent();
	return {
		status: 200,
		body: JSON.stringify(event),
	};
};

export {
	get
};
