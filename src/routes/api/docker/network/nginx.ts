import type {RequestHandler} from '@sveltejs/kit';
import {checkContainer, checkContainerConnected} from '$lib/server/network/nginx';


const get:RequestHandler = async () => {
	const isContainer = await checkContainer();
	if (!isContainer) {
		return {
			status: 500,
			body: 'not running',
		};
	}
	const isConnected = await checkContainerConnected();
	if(!isConnected){
		return {
			status: 500,
			body: 'not connected',
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
