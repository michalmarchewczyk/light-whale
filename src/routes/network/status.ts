import type {RequestHandler} from '@sveltejs/kit';
import {checkNetwork} from '$lib/network/network';


const get:RequestHandler = async () => {
	const isNetwork = await checkNetwork();
	if (!isNetwork) {
		return {
			status: 500,
			body: 'Network is not available',
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
