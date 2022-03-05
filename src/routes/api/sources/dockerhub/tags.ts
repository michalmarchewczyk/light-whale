import type {RequestHandler} from '@sveltejs/kit';


const get:RequestHandler = async ({url}) => {
	let image = url.searchParams.get('image') ?? '';
	image = image.includes('/') ? image : 'library/'+image;
	const res = await fetch(`https://hub.docker.com/v2/repositories/${image}/tags/?page_size=100&page=1`, {
		method: 'GET',
	});
	if(res.status !== 200){
		return {
			status: 500,
		};
	}
	const data = await res.json();
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(data)
	};
};

export {
	get
};
