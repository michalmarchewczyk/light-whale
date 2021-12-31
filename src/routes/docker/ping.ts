import {pingDocker} from '$lib/docker/ping';
import type {RequestHandler} from '@sveltejs/kit';

const get:RequestHandler<Promise<void>, void> = async () => {
	const ping = await pingDocker();
	return {
		status: 200,
		body: ping.toString(),
	};
};

export {
	get
};
