import type {ServerRequest} from '@sveltejs/kit/types/hooks';
import {getSavedSession} from '$lib/auth/sessions';
import cookie from 'cookie';


export function getSession(request:ServerRequest):Record<string, unknown> {
	const sessionCookie = request.headers['cookie'];
	if (!sessionCookie) {
		return {};
	}
	const id = cookie.parse(sessionCookie).sessionId;
	const session = getSavedSession(id);
	if (!session || Date.now() > session.expires) {
		return {};
	}
	return {
		id: session.id,
	};
}
