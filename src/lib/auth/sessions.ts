import {v4 as uuidv4} from 'uuid';
import type {RequestHeaders} from '@sveltejs/kit/types/helper';
import cookie from 'cookie';

interface Session {
	id:string,
	expires:number,
}

const sessions = [];


export const createSession = ():Session => {
	const newId = uuidv4();
	const newSession = {
		id: newId,
		expires: Date.now() + 1000 * 60 * 60 * 24
	};
	sessions.push(newSession);
	return newSession;
};

export const getSavedSession = (id:string):Session | null => {
	return sessions.find(s => s.id === id);
};

export const invalidateSession = (id:string):void => {
	const session = sessions.find(s => s.id === id);
	if (!session) return;
	session.expires = 0;
};

export const checkSession = (headers:RequestHeaders):boolean => {
	const sessionCookie = headers['cookie'];
	if (!sessionCookie) {
		return false;
	}
	const id = cookie.parse(sessionCookie).sessionId;
	const session = getSavedSession(id);
	return !(!session || Date.now() > session.expires);

};
