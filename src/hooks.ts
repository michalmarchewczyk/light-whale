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
	let ipAddress = '';
	try {
		ipAddress = event.clientAddress ?? 'unknown';
	}catch(e){
		ipAddress = 'unknown';
	}
	logger.log(LogType.Router, `GET ${url}; Origin: ${event.url.origin}; IP Address: ${ipAddress}`);
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
