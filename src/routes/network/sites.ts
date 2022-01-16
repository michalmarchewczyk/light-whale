import type {RequestHandler} from '@sveltejs/kit';
import {getSites, Site} from '$lib/nginx/sites';
import {checkContainer} from '$lib/nginx/setup';


const get:RequestHandler<Promise<void>, void> = async () => {
	const isContainer = await checkContainer();
	if(!isContainer){
		return {
			status: 500,
		};
	}
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
