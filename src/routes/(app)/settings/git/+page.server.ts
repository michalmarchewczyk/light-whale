import type { Actions, PageServerLoad } from './$types';
import { tokensManager } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import { gitServicesController } from '$lib/server/sources/git';

export const load = (async () => {
	const allTokens = await gitServicesController.listAllTokens();
	return {
		tokens: allTokens
	};
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('token');
		const username = data.get('username');
		const description = data.get('description');
		const service = data.get('service');
		if (!token || typeof token !== 'string') {
			return fail(400, { error: 'Invalid token' });
		}
		if (!['github', 'gitlab', 'bitbucket'].includes(<string>service)) {
			return fail(400, { error: 'Invalid service' });
		}
		const password = data.get('password');
		if (!password || typeof password !== 'string') {
			return fail(400, { error: 'Invalid password' });
		}
		const newToken = service === 'bitbucket' ? `${username}:${token}` : token;
		const added = await tokensManager.addToken(
			newToken,
			password,
			<string>service,
			<string>description
		);
		if (!added) {
			return fail(400, { error: 'Invalid password' });
		}
	},
	remove: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		if (!id || typeof id !== 'string') {
			return fail(400, { removeError: 'Invalid id' });
		}
		const password = data.get('password');
		if (!password || typeof password !== 'string') {
			return fail(400, { removeError: 'Invalid password' });
		}
		const removed = await tokensManager.removeToken(id, password);
		if (!removed) {
			return fail(400, { removeError: 'Invalid password' });
		}
	}
} satisfies Actions;
