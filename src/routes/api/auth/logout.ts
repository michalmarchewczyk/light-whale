import type {RequestHandler} from '@sveltejs/kit';
import cookie from 'cookie';
import {sessionManager} from '$lib/server/auth';

const get:RequestHandler = async ({request}) => {
	const sessionCookie = request.headers.get('cookie');
	if (!sessionCookie) {
		return {status: 400};
	}
	const id = cookie.parse(sessionCookie).sessionId;
	sessionManager.invalidateSession(id);
	return {
		status: 200,
	};
};

export {
	get,
};
