import cookie from 'cookie';
import type {GetSession, Handle} from '@sveltejs/kit';
import {logger, LogType} from '$lib/server/utils/Logger';
import {sessionManager} from '$lib/server/auth';

const handle:Handle = async ({event, resolve}) => {
	const url = event.url.toString();
	if(event.url.searchParams.get('skipLogger') === 'true'){
		return resolve(event);
	}
	const ipAddress = event?.clientAddress ?? 'unknown';
	logger.log(LogType.Router, `${event.request.method} ${url}; Origin: ${event.url.origin}; IP Address: ${ipAddress}`);
	const response = await resolve(event);
	logger.log(LogType.Router, `${event.request.method} RESPONSE ${url} - ${response.status} ${response.statusText}`);
	return response;
};

const getSession:GetSession = ({request}) => {
	const sessionCookie = request.headers.get('cookie');
	if (!sessionCookie) {
		return {};
	}
	const id = cookie.parse(sessionCookie).sessionId;
	const session = sessionManager.getSession(id);
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
