import type {RequestHandler} from '@sveltejs/kit';
import validator from 'validator';
import { authGuard } from '$lib/server/auth/authGuard';
import {containersController} from '$lib/server/docker';

const get:RequestHandler = async ({params, url, request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const id = params.id;
	if (!id) {
		return {
			status: 400,
		};
	}
	const path = url.searchParams.get('path') ?? '';
	if (!validator.isAlphanumeric(id) || !validator.isURL(path, {
		require_valid_protocol: false,
		require_host: false,
	})) {
		return {
			status: 400,
		};
	}
	const container = await containersController.getContainer(id);
	if(!container){
		return {
			status: 500,
		};
	}
	const data = await container.readPath(path);
	if(typeof data === 'string'){
		return {
			status: 200,
			body: JSON.stringify({type: 'file', data}),
		};
	}else{
		if (!data || data.length < 1) {
			return {
				status: 400,
			};
		}
		return {
			status: 200,
			body: JSON.stringify({type: 'folder', data}),
		};
	}
};

export {
	get,
};
