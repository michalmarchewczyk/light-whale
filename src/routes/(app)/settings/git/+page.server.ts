import type { Actions, PageServerLoad } from './$types';
import { tokensManager } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import { gitServicesController } from '$lib/server/sources/git';

export const load = (async () => {
	return {
		tokens: await gitServicesController.listAllTokens(),
		tokenFields: gitServicesController.getServiceTokenFields()
	};
}) satisfies PageServerLoad;

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const service = data.get('service');
		const tokenFields = gitServicesController.getServiceTokenFields();
		if (!Object.keys(tokenFields).includes(<string>service)) {
			return fail(400, { error: 'Invalid service' });
		}
		const password = data.get('password');
		for (const field of tokenFields[<string>service]) {
			const value = data.get(field);
			if (!value || typeof value !== 'string') {
				return fail(400, { error: `Invalid ${field}` });
			}
		}
		const token = tokenFields[<string>service].map((field) => data.get(field)).join(':');
		if (!password || typeof password !== 'string') {
			return fail(400, { error: 'Invalid password' });
		}
		const description = data.get('description');
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
