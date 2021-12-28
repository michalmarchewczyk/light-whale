import type {EndpointOutput, Request} from '@sveltejs/kit';
import {createSession} from '$lib/auth/sessions';
import cookie from 'cookie';
import {login} from '$lib/auth/login';

export async function post({body}:Request):Promise<EndpointOutput> {
	const {password} = JSON.parse(<string>body);
	if(!password){
		return {
			status: 401,
			body: JSON.stringify({msg: 'empty password'}),
		};
	}
	if(!login(password)){
		return {
			status: 401,
			body: JSON.stringify({msg: 'wrong password'}),
		};
	}
	const session = createSession();
	const sessionCookie = cookie.serialize('sessionId', session.id, {
		httpOnly: true,
		maxAge: 60 * 60 * 24,
		path: '/'
	});
	return {
		status: 200,
		body: JSON.stringify({msg: 'logged in', session}),
		headers: {
			'Set-Cookie': sessionCookie,
		}
	};
}
