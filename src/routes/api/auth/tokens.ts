import type {RequestHandler} from '@sveltejs/kit';
import { authGuard } from '$lib/server/auth/authGuard';
import {tokenManager} from '$lib/server/auth';

export const post:RequestHandler = async ({request}) => {
	if (!authGuard(request.headers)) {
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
	const saved = await tokenManager.addToken(token, password, service, description);
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
	if (!authGuard(request.headers)) {
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
	const deleted = await tokenManager.removeToken(id);
	if(!deleted) {
		return {
			status: 400,
		};
	}
	return {
		status: 200,
	};
};
