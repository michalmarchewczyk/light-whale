import type { Actions } from './$types';
import { authController } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const password = data.get('password');
		if (!password || typeof password !== 'string') {
			return fail(400, { message: 'Invalid password' });
		}
		const setPassword = await authController.setPassword(password);
		if (!setPassword) {
			return fail(400, { message: 'Password strength too low' });
		}
		redirect(307, '/');
	}
} satisfies Actions;
