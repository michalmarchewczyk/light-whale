import type { Actions } from './$types';
import { authController, tokensManager } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const password = data.get('password');
		if (!password || typeof password !== 'string') {
			return fail(400, { message: 'Invalid password' });
		}
		const setupToken = await authController.getTempData('setupToken');
		const setupTokenDescription = await authController.getTempData('setupTokenDescription');
		const setPassword = await authController.setPassword(password);
		if (!setPassword) {
			return fail(400, { message: 'Password strength too low' });
		}
		if (setupToken) {
			await tokensManager.addToken(setupToken, password, 'github', setupTokenDescription);
		}
		redirect(307, '/');
	}
} satisfies Actions;
