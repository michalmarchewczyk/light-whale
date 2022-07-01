import { authGuard } from '$lib/server/auth/authGuard';
import type {RequestHandler} from '@sveltejs/kit';
import {dockerController} from '$lib/server/docker';


const get:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const event = await dockerController.getLastEvent();
	return {
		status: 200,
		body: JSON.stringify(event),
	};
};

export {
	get,
};
