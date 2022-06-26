import type {RequestHandler} from '@sveltejs/kit';

import {createContainer, getContainers} from '$lib/server/docker/containers';
import validator from 'validator';
import { authGuard } from '$lib/server/auth/authGuard';

const get:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const containers = await getContainers();
	return {
		status: 200,
		body: JSON.stringify(containers),
	};
};

const post:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const {imageId, name, command} = await request.json();
	if (!validator.isHash(imageId.substring(7) ?? '', 'sha256')
		|| !(validator.matches(name, /^\/?[a-zA-Z0-9][a-zA-Z0-9_.-]+$/) || name === '')) {
		return {
			status: 400,
		};
	}
	const res = await createContainer(imageId, name, command);
	if (res) {
		return {
			status: 200,
		};
	} else {
		return {
			status: 500,
		};
	}
};

export {
	get,
	post
};
