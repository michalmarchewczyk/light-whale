import type { Actions, PageServerLoad } from './$types';
import { tokensManager } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import { dnsProvidersController, ipSettingsController } from '$lib/server/dns';
import validator from 'validator';

export const load = (async ({ depends }) => {
	depends('app:dns');
	return {
		tokens: await dnsProvidersController.listAllTokens(),
		tokenFields: dnsProvidersController.getProviderTokenFields(),
		ipSettings: {
			v4addresses: ipSettingsController.listV4Addresses(),
			v6addresses: ipSettingsController.listV6Addresses(),
			publicIp: ipSettingsController.detectPublicIp(),
			autoAddIp: ipSettingsController.isAutoAdd()
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	addToken: async ({ request }) => {
		const data = await request.formData();
		const service = data.get('service');
		const tokenFields = dnsProvidersController.getProviderTokenFields();
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
	removeToken: async ({ request }) => {
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
	},
	addIp: async ({ request }) => {
		const data = await request.formData();
		const ip = data.get('address');
		if (!ip || typeof ip !== 'string' || !validator.isIP(ip)) {
			return fail(400, { ipError: 'Invalid ip' });
		}
		const added = await ipSettingsController.addIp(ip);
		if (!added) {
			return fail(500, { ipError: 'Failed to add ip' });
		}
	},
	removeIp: async ({ request }) => {
		const data = await request.formData();
		const ip = data.get('address');
		if (!ip || typeof ip !== 'string') {
			return fail(400, { ipError: 'Invalid ip' });
		}
		const removed = await ipSettingsController.removeIp(ip);
		if (!removed) {
			return fail(500, { ipError: 'Failed to remove ip' });
		}
	},
	updateIpSettings: async ({ request }) => {
		const data = await request.formData();
		const autoAdd = data.has('autoAdd');
		await ipSettingsController.updateSettings({ autoAdd });
	}
} satisfies Actions;
