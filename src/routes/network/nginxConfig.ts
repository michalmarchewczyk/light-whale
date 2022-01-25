import type {RequestHandler} from '@sveltejs/kit';
import {checkContainerPorts, checkContainerRestart} from '$lib/network/nginx';


const get:RequestHandler = async () => {
	const ports = await checkContainerPorts();
	if(!ports) {
		return {
			status: 500,
			body: 'ports'
		};
	}
	const restart = await checkContainerRestart();
	if(!restart) {
		return {
			status: 500,
			body: 'restart'
		};
	}
	return {
		status: 200,
		body: 'ok',
	};
};

export {
	get,
};
