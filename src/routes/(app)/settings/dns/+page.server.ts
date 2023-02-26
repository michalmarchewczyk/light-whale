import type { Actions, PageServerLoad } from './$types';
import { tokensManager } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import { dnsProvidersController } from '$lib/server/dns';

export const load = (async () => {
	const allTokens = await dnsProvidersController.listAllTokens();
	return {
		tokens: allTokens
	};
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const token = data.get('token');
		const description = data.get('description');
		const service = data.get('service');
		if (!token || typeof token !== 'string') {
			return fail(400, { error: 'Invalid token' });
		}
		if (!['cloudflare'].includes(<string>service)) {
			return fail(400, { error: 'Invalid service' });
		}
		const password = data.get('password');
		if (!password || typeof password !== 'string') {
			return fail(400, { error: 'Invalid password' });
		}
		const added = await tokensManager.addToken(
			token,
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
