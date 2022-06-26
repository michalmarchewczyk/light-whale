import type {RequestHandler} from '@sveltejs/kit';
import cookie from 'cookie';
import {tokenManager} from '$lib/server/auth/TokenManager';
import {sessionManager} from '$lib/server/auth/SessionManager';
import {authController} from '$lib/server/auth/AuthController';

const post:RequestHandler = async ({request}) => {
	const {password} = await request.json();
	if (!password) {
		return {
			status: 401,
			body: JSON.stringify({msg: 'empty password'}),
		};
	}
	if (!await authController.login(password)) {
		return {
			status: 401,
			body: JSON.stringify({msg: 'wrong password'}),
		};
	}
	const session = sessionManager.createSession();
	const sessionCookie = cookie.serialize('sessionId', session.id, {
		httpOnly: true,
		maxAge: 60 * 60 * 24,
		path: '/',
	});
	await tokenManager.initialize(password);
	return {
		status: 200,
		body: JSON.stringify({msg: 'logged in', session}),
		headers: {
			'Set-Cookie': sessionCookie,
		},
	};
};

export {
	post,
};
