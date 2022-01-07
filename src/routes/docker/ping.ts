import {pingDocker} from '$lib/docker/ping';
import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/auth/sessions';

const get:RequestHandler<Promise<void>, void> = async ({headers}) => {
	if(!checkSession(headers)){
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
	get
};
