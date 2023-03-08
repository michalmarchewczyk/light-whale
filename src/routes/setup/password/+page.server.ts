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
		const setupDnsService = await authController.getTempData('setupDnsService');
		const setupDnsToken = await authController.getTempData('setupDnsToken');
		const setupDnsTokenDescription = await authController.getTempData('setupDnsTokenDescription');
		const setupGithubToken = await authController.getTempData('setupGithubToken');
		const setupGithubTokenDescription = await authController.getTempData(
			'setupGithubTokenDescription'
		);
		const setPassword = await authController.setPassword(password);
		if (!setPassword) {
			return fail(400, { message: 'Password strength too low' });
		}
		if (setupDnsService && setupDnsToken) {
			await tokensManager.addToken(
				setupDnsToken,
				password,
				<string>setupDnsService,
				setupDnsTokenDescription
			);
		}
		if (setupGithubToken) {
			await tokensManager.addToken(
				setupGithubToken,
				password,
				'github',
				setupGithubTokenDescription
			);
		}
		redirect(307, '/');
	}
} satisfies Actions;
