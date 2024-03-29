import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { authController } from '$lib/server/auth';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('pat');
		const description = data.get('description');
		if (!token || typeof token !== 'string') {
			return fail(400, { message: 'Invalid token' });
		}
		await authController.setTempData('setupGithubToken', token);
		await authController.setTempData('setupGithubTokenDescription', <string>description);
		throw redirect(307, '/setup/password');
	}
} satisfies Actions;
