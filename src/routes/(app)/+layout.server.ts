import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { authController, sessionManager } from '$lib/server/auth';

export const load = (async ({ cookies }) => {
	if (!(await authController.checkPasswordSet())) {
		throw redirect(307, '/setup');
	}
	const sessionId = cookies.get('sessionId');
	if (!sessionId || !sessionManager.checkSession(sessionId)) {
		throw redirect(307, '/login');
	}
}) satisfies LayoutServerLoad;
