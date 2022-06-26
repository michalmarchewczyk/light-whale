import { authGuard } from '$lib/server/auth/authGuard';
import {pingDocker} from '$lib/server/docker/ping';
import type {RequestHandler} from '@sveltejs/kit';

const get:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const ping = await pingDocker();
	return {
		status: 200,
		body: ping.toString(),
	};
};

export {
	get,
};
