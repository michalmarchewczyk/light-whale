import type {RequestHandler} from '@sveltejs/kit';
import ListCache from '$lib/utils/ListCache';

const cachedLists = new ListCache<unknown[]>(async (index) => {
	const res = await fetch(`https://hub.docker.com/api/content/v1/products/search?page_size=50&q=${index}
	&type=image`, {
		method: 'GET',
		headers: {'Search-Version': 'v3'}
	});
	if(res.status !== 200){
		return;
	}
	return await res.json();
});

const get:RequestHandler = async ({url}) => {
	const query = url.searchParams.get('query') ?? '';
	const images = await cachedLists.get(query);
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(images)
	};
};

export {
	get
};
