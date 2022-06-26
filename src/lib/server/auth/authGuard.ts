import type {RequestEvent} from '@sveltejs/kit';
import cookie from 'cookie';
import {sessionManager} from '$lib/server/auth/SessionManager';

export const authGuard = (headers:RequestEvent['request']['headers']):boolean => {
	const sessionCookie = headers.get('cookie');
	if (!sessionCookie) {
		return false;
	}
	const id = cookie.parse(sessionCookie).sessionId;
	return sessionManager.checkSession(id);
};
