import { authGuard } from '$lib/server/auth/authGuard';
import {getLastEvent} from '$lib/server/docker/events';
import type {RequestHandler} from '@sveltejs/kit';


const get:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
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
