import type {RequestHandler} from '@sveltejs/kit';
import {getSites, Site} from '$lib/nginx/sites';


const get:RequestHandler<Promise<void>, void> = async () => {
	let sites:Site[] = await getSites();
	sites = sites.sort((a, b) => b.created.getTime() - a.created.getTime());
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(sites),
	};
};

export {
	get
};
