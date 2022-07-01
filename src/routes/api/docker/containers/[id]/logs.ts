import type {RequestHandler} from '@sveltejs/kit';
import validator from 'validator';
import { authGuard } from '$lib/server/auth/authGuard';
import {containersController} from '$lib/server/docker';

const get:RequestHandler = async ({params, request}) => {
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
	if (!validator.isAlphanumeric(id)) {
		return {
			status: 400,
		};
	}
	const container = await containersController.getContainer(id);
	if(!container) {
		return {
			status: 500,
		};
	}
	const data = await container.getLogs();
	return {
		status: 200,
		body: data,
	};
};

export {
	get,
};
