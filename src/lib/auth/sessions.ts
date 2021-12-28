import {v4 as uuidv4} from 'uuid';

interface Session {
	id: string,
	expires: number,
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

export const getSavedSession = (id: string):Session|null => {
	return sessions.find(s => s.id === id);
};

export const invalidateSession = (id: string):void => {
	const session = sessions.find(s => s.id === id);
	if(!session) return;
	session.expires = 0;
};
