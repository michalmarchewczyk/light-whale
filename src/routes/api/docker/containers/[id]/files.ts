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
	const type:'file'|'dir' = url.searchParams.get('type') === 'file' ? 'file' : 'dir';
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
	if(type === 'file'){
		const data = await container.readFile(path);
		if (!data) {
			return {
				status: 400,
			};
		}
		return {
			status: 200,
			body: data,
		};
	}else{
		const data = await container.getFiles(path);
		if (!data || data.length < 1) {
			return {
				status: 400,
			};
		}
		return {
			status: 200,
			body: JSON.stringify(data),
		};
	}
};

export {
	get,
};
