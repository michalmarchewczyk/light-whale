import type {RequestHandler} from '@sveltejs/kit';
import {checkNginx} from '$lib/setup/nginx';

const get:RequestHandler = async () => {
	const check = await checkNginx();
	if(check !== 'ok'){
		return {
			status: 500,
			body: check,
		};
	}
	return {
		status: 200,
		body: check,
	};
};

export {
	get,
};
