import type {RequestHandler} from '@sveltejs/kit';
import {checkNginx, createNginxContainer} from '$lib/server/setup/nginx';

const get:RequestHandler = async () => {
	const check = await checkNginx();
	if(check === 'ok'){
		return {
			status: 500,
		};
	}
	const create = await createNginxContainer();
	if(create !== 'ok'){
		return {
			status: 500,
			body: create
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
