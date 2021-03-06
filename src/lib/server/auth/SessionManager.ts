import uuid from 'uuid';
import {logger, LogType} from '$lib/server/utils/Logger';
import type {Session} from '$lib/server/auth/Session.interface';

export default class SessionManager {
	private sessions: Session[] = [];

	public createSession(): Session {
		const newId = uuid.v4();
		const newSession = {
			id: newId,
			expires: Date.now() + 1000 * 60 * 60 * 24,
		};
		this.sessions.push(newSession);
		logger.log(LogType.Info, `Created new session with id: ${newId}`);
		return newSession;
	}

	public invalidateSession(id:string):void {
		logger.log(LogType.Info, `Invalidated session with id: ${id}`);
		const session = this.sessions.find(s => s.id === id);
		if (!session) {
			return;
		}
		session.expires = 0;
	}

	public checkSession(sessionId:string):boolean {
		const session = this.sessions.find(s => s.id === sessionId);
		if(!session || Date.now() > session.expires){
			logger.log(LogType.Warning, 'Tried to access without authorization');
			return false;
		}
		return true;
	}

	public getSession(id):Session | null {
		const session = this.sessions.find(s => s.id === id);
		if(!session){
			return null;
		}
		return session;
	}
}
