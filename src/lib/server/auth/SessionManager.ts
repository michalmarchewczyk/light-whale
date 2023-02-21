import * as uuid from 'uuid';
import type { Session } from '$lib/server/auth/Session';
import { logger } from '$lib/server/utils/Logger';

export default class SessionManager {
	private sessions: Session[] = [];

	constructor() {
		logger.logVerbose('SessionManager initialized');
	}

	public createSession(): Session {
		const newId = uuid.v4();
		const newSession = {
			id: newId,
			expires: Date.now() + 1000 * 60 * 60 * 24
		};
		this.sessions.push(newSession);
		logger.logInfo(`Created new session with id ${newId}`);
		return newSession;
	}

	public invalidateSession(id: string): void {
		const session = this.sessions.find((s) => s.id === id);
		if (!session) {
			return;
		}
		session.expires = 0;
		logger.logInfo(`Invalidated session with id ${id}`);
	}

	public checkSession(sessionId: string): boolean {
		logger.logVerbose(`Checking session with id ${sessionId}`);
		const session = this.sessions.find((s) => s.id === sessionId);
		return !(!session || Date.now() > session.expires);
	}
}
