import type {RequestHandler} from '@sveltejs/kit';
import {getSites, Site} from '$lib/nginx/sites';


const get:RequestHandler<Promise<void>, void> = async () => {
	const sites:Site[] = await getSites();
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(sites),
	};
};

export {
	get
};
