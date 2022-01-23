import type {RequestHandler} from '@sveltejs/kit';
import {checkContainer, NGINX_CONTAINER_NAME} from '$lib/network/nginx';


const get:RequestHandler = async () => {
	const isContainer = await checkContainer();
	if (!isContainer) {
		return {
			status: 500,
			body: `${NGINX_CONTAINER_NAME} is not running`,
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
