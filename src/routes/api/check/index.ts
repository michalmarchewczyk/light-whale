import type {RequestHandler} from '@sveltejs/kit';
import {authGuard} from '$lib/server/auth/authGuard';
import {statusChecker} from '$lib/server/check/StatusChecker';

const get:RequestHandler = async ({request}) => {
	if(!authGuard(request.headers)) {
		return {
			status: 401,
		};
	}
	const status = await statusChecker.check();
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(status),
	};
};

export {
	get
};
