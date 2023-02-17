import { authController, sessionManager, tokensManager } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ cookies }) => {
	if (!(await authController.checkPasswordSet())) {
		throw redirect(307, '/setup');
	}
	const sessionId = cookies.get('sessionId');
	if (sessionId && sessionManager.checkSession(sessionId)) {
		throw redirect(307, '/');
	}
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const password = data.get('password');
		if (!password || typeof password !== 'string') {
			return fail(400, { passwordError: 'Invalid password' });
		}
		const check = await authController.login(password);
		if (!check) {
			return fail(400, { passwordError: 'Invalid password' });
		}
		const sessionId = sessionManager.createSession();
		cookies.set('sessionId', sessionId.id);
		await tokensManager.initialize(password);
		redirect(307, '/');
	}
} satisfies Actions;
