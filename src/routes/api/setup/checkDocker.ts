import type {RequestHandler} from '@sveltejs/kit';
import {pingDocker} from '$lib/server/docker/ping';
import {getDockerVersion} from '$lib/server/setup/system';

const get:RequestHandler = async () => {
	const version = await getDockerVersion();
	if(!version){
		return {
			status: 500,
			body: 'no-docker'
		};
	}
	const ping = await pingDocker();
	if(!ping){
		return {
			status: 500,
			body: 'no-ping'
		};
	}
	return {
		status: 200,
		body: 'ok'
	};
};

export {
	get,
};
