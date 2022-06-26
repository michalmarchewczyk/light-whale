import type {RequestHandler} from '@sveltejs/kit';

import validator from 'validator';
import {removeContainer, restartContainer, startContainer, stopContainer} from '$lib/server/docker/containers';
import { authGuard } from '$lib/server/auth/authGuard';

const put:RequestHandler = async ({params, request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const id = params.id;
	const {action} = await request.json();
	if (!validator.isAlphanumeric(id ?? '') || !validator.isAlphanumeric(action ?? '')) {
		return {
			status: 400,
		};
	}
	let res;
	if (action === 'start') {
		res = await startContainer(id);
	} else if (action === 'stop') {
		res = await stopContainer(id);
	} else if (action === 'restart') {
		res = await restartContainer(id);
	} else {
		res = false;
	}
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};


const del:RequestHandler = async ({params, request}) => {
	if (!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const id = params.id;
	if (!validator.isAlphanumeric(id ?? '')) {
		return {
			status: 400,
		};
	}
	const res = await removeContainer(id);
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};

export {
	put,
	del
};
