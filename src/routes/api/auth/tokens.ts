import {checkSession, getSessionTokens, addSessionToken} from '$lib/server/auth/sessions';
import type {RequestHandler} from '@sveltejs/kit';
import {saveToken} from '$lib/server/auth/tokens';

export const get:RequestHandler = async({request}) => {
	if(!checkSession(request.headers)){
		return {
			status: 401,
		};
	}
	const tokens = getSessionTokens(request.headers);
	const tokenServices = tokens.map(t => t.service);
	return {
		status: 200,
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(tokenServices)
	};
};

export const post:RequestHandler = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const {service, token, password}:{service:string, token:string, password:string} = await request.json();
	if (!service || !token) {
		return {
			status: 400,
		};
	}
	const saved = await saveToken(token, password, service);
	if(!saved) {
		return {
			status: 400,
		};
	}
	await addSessionToken(request.headers, {service, token});
	return {
		status: 200,
	};
};
