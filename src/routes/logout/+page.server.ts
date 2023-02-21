import { authController, sessionManager } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	if (!(await authController.checkPasswordSet())) {
		throw redirect(307, '/setup');
	}
	const sessionId = cookies.get('sessionId');
	if (!sessionId || !sessionManager.checkSession(sessionId)) {
		throw redirect(307, '/login');
	}
	sessionManager.invalidateSession(sessionId);
	cookies.delete('sessionId');
}) satisfies PageServerLoad;
