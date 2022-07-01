import type {RequestHandler} from '@sveltejs/kit';
import validator from 'validator';
import { authGuard } from '$lib/server/auth/authGuard';
import {containersController} from '$lib/server/docker';

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
	const container = await containersController.getContainer(id);
	if(!container) {
		return {
			status: 500,
		};
	}
	if (action === 'start') {
		res = await container.start();
	} else if (action === 'stop') {
		res = await container.stop();
	} else if (action === 'restart') {
		res = await container.restart();
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
	const container = await containersController.getContainer(id);
	if(!container) {
		return {
			status: 500,
		};
	}
	const res = await container.remove();
	return {
		status: 200,
		body: JSON.stringify({success: res}),
	};
};

export {
	put,
	del
};
