import {getSavedSession} from '$lib/auth/sessions';
import cookie from 'cookie';
import type {GetSession, Handle} from '@sveltejs/kit';
import Logger, {LogType} from '$lib/utils/Logger';

const logger = Logger.getInstance();

const handle:Handle = async ({event, resolve}) => {
	const url = event.url.toString();
	// TODO: Remove when streaming is available in SvelteKit
	if(url.endsWith('/docker/ping') || url.endsWith('/docker/events')
		|| url.endsWith('/network/status') || url.endsWith('/network/nginx')){
		return resolve(event);
	}
	logger.log(LogType.Router, `${event.request.method} ${url}`);
	return resolve(event);
};

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
	handle,
	getSession
};
