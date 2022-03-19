import {getSavedSession} from '$lib/server/auth/sessions';
import cookie from 'cookie';
import type {GetSession, Handle} from '@sveltejs/kit';
import Logger, {LogType} from '$lib/server/utils/Logger';

const logger = Logger.getInstance();

const handle:Handle = async ({event, resolve}) => {
	const url = event.url.toString();
	if(event.url.searchParams.get('skipLogger') === 'true'){
		return resolve(event);
	}
	logger.log(LogType.Router, `${event.request.method} ${url} IP Address: ${event.clientAddress ?? 'unknown'}`);
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
