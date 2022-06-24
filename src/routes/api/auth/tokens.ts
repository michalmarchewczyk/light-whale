import {checkSession} from '$lib/server/auth/sessions';
import type {RequestHandler} from '@sveltejs/kit';
import {getAllTokens, removeToken, saveToken} from '$lib/server/auth/tokens';

export const get:RequestHandler = async({request}) => {
	if(!checkSession(request.headers)){
		return {
			status: 401,
		};
	}
	const tokens = getAllTokens();
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
	const {service, token, password, description}:{service:string, token:string, password:string, description:string} = await request.json();
	if (!service || !token) {
		return {
			status: 400,
		};
	}
	const saved = await saveToken(token, password, service, description);
	if(!saved) {
		return {
			status: 400,
		};
	}
	return {
		status: 200,
	};
};

export const del:RequestHandler = async ({request}) => {
	if (!checkSession(request.headers)) {
		return {
			status: 401,
		};
	}
	const {id}:{id:string} = await request.json();
	if (!id) {
		return {
			status: 400,
		};
	}
	const deleted = await removeToken(id);
	if(!deleted) {
		return {
			status: 400,
		};
	}
	return {
		status: 200,
	};
};
