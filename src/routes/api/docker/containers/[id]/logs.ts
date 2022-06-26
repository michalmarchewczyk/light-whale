import type {RequestHandler} from '@sveltejs/kit';

import validator from 'validator';
import {getContainerLogs} from '$lib/server/docker/containers';
import { authGuard } from '$lib/server/auth/authGuard';

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
	const data = await getContainerLogs(id);
	return {
		status: 200,
		body: data,
	};
};

export {
	get,
};
