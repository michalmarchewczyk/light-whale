import {getLastEvent} from '$lib/docker/events';
import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/auth/sessions';

const get:RequestHandler<Promise<void>, void> = async ({headers}) => {
	if (!checkSession(headers)) {
		return {
			status: 401,
		};
	}
	const event = await getLastEvent();
	return {
		status: 200,
		body: JSON.stringify(event),
	};
};

export {
	get,
};
