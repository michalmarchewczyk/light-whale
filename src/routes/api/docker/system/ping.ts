import {pingDocker} from '$lib/server/docker/ping';
import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/server/auth/sessions';

const get:RequestHandler = async ({request}) => {
	if (!checkSession(request.headers)) {
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
