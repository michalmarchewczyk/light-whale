import type {EndpointOutput, Request} from '@sveltejs/kit';
import cookie from 'cookie';
import {invalidateSession} from '$lib/auth/sessions';

export async function get({headers}:Request):Promise<EndpointOutput> {
	const sessionCookie = headers['cookie'];
	if(!sessionCookie){
		return {status: 400};
	}
	const id = cookie.parse(sessionCookie).sessionId;
	invalidateSession(id);
	return {
		status: 200,
	};
}
