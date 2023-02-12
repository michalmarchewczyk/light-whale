import uuid from 'uuid';
import type { Session } from '$lib/server/auth/Session';

export default class SessionManager {
	private sessions: Session[] = [];

	public createSession(): Session {
		const newId = uuid.v4();
		const newSession = {
			id: newId,
			expires: Date.now() + 1000 * 60 * 60 * 24
		};
		this.sessions.push(newSession);
		return newSession;
	}

	public invalidateSession(id: string): void {
		const session = this.sessions.find((s) => s.id === id);
		if (!session) {
			return;
		}
		session.expires = 0;
	}

	public checkSession(sessionId: string): boolean {
		const session = this.sessions.find((s) => s.id === sessionId);
		return !(!session || Date.now() > session.expires);
	}

	public getSession(id: string): Session | null {
		const session = this.sessions.find((s) => s.id === id);
		if (!session) {
			return null;
		}
		return session;
	}
}
