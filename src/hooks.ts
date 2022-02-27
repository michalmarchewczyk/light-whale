import {getSavedSession} from '$lib/auth/sessions';
import cookie from 'cookie';
import type {GetSession} from '@sveltejs/kit';


const getSession:GetSession = (event) => {
	const sessionCookie = event.request.headers.get('cookie');
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
};

export {
	getSession
};
