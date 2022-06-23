import {v4 as uuidv4} from 'uuid';
import cookie from 'cookie';
import {logger, LogType} from '$lib/server/utils/Logger';
import type {RequestEvent} from '@sveltejs/kit';

interface Session {
	id:string,
	expires:number,
	tokens:{service:string, token:string}[],
}

const sessions = [];


export const createSession = ():Session => {
	const newId = uuidv4();
	const newSession = {
		id: newId,
		expires: Date.now() + 1000 * 60 * 60 * 24,
		tokens: []
	};
	sessions.push(newSession);
	logger.log(LogType.Info, `Created new session with id: ${newId}`);
	return newSession;
};

export const getSavedSession = (id:string):Session | null => {
	return sessions.find(s => s.id === id);
};

export const invalidateSession = (id:string):void => {
	logger.log(LogType.Info, `Logged out session with id: ${id}`);
	const session = sessions.find(s => s.id === id);
	if (!session) {
		return;
	}
	session.expires = 0;
};

export const checkSession = (headers:RequestEvent['request']['headers']):boolean => {
	const sessionCookie = headers.get('cookie');
	if (!sessionCookie) {
		return false;
	}
	const id = cookie.parse(sessionCookie).sessionId;
	const session = getSavedSession(id);
	if(!session || Date.now() > session.expires){
		logger.log(LogType.Warning, 'Tried to access without authorization');
		return false;
	}
	return true;
};

export const getSessionTokens = (headers:RequestEvent['request']['headers']):{service:string, token:string}[] => {
	const sessionCookie = headers.get('cookie');
	if (!sessionCookie) {
		return [];
	}
	const id = cookie.parse(sessionCookie).sessionId;
	const session = getSavedSession(id);
	if(!session){
		return [];
	}
	return session.tokens;
};

export const addSessionToken = (headers:RequestEvent['request']['headers'], token:{service:string, token:string}):void => {
	const sessionCookie = headers.get('cookie');
	if (!sessionCookie) {
		return;
	}
	const id = cookie.parse(sessionCookie).sessionId;
	const session = getSavedSession(id);
	if(!session){
		return;
	}
	session.tokens = [...session.tokens, token];
};
