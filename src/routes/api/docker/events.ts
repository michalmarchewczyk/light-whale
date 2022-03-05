import {getLastEvent} from '$lib/server/docker/events';
import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/server/auth/sessions';

const get:RequestHandler<Promise<void>, string> = async ({request}) => {
	if (!checkSession(request.headers)) {
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
