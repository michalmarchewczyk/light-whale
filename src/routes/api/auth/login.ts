import type {RequestHandler} from '@sveltejs/kit';
import {createSession} from '$lib/server/auth/sessions';
import cookie from 'cookie';
import {login} from '$lib/server/auth/login';

const post:RequestHandler = async ({request}) => {
	const {password} = await request.json();
	if (!password) {
		return {
			status: 401,
			body: JSON.stringify({msg: 'empty password'}),
		};
	}
	if (!await login(password)) {
		return {
			status: 401,
			body: JSON.stringify({msg: 'wrong password'}),
		};
	}
	const session = createSession();
	const sessionCookie = cookie.serialize('sessionId', session.id, {
		httpOnly: true,
		maxAge: 60 * 60 * 24,
		path: '/',
	});
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
