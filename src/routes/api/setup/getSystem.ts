import type {RequestHandler} from '@sveltejs/kit';
import {getSystem} from '$lib/server/setup/system';

const get:RequestHandler = async () => {
	const system = await getSystem();
	return {
		status: 200,
		body: system,
	};
};

export {
	get,
};
