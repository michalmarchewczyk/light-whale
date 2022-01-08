import type {RequestHandler} from '@sveltejs/kit';
import {checkSession} from '$lib/auth/sessions';
import {getImages} from '$lib/docker/images';

const get:RequestHandler<Promise<void>, void> = async ({headers}) => {
	if(!checkSession(headers)){
		return {
			status: 401,
		};
	}
	const images = await getImages();
	return {
		status: 200,
		body: JSON.stringify(images)
	};
};

export {
	get
};
