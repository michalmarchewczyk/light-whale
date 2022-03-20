import type {RequestHandler} from '@sveltejs/kit';
import {checkSetup} from '$lib/server/setup/check';

const get:RequestHandler = async () => {
	const isSetup = await checkSetup();
	if(!isSetup){
		return {
			status: 500,
			body: 'false'
		};
	}
	return {
		status: 200,
		body: 'true'
	};
};

export {
	get,
};
