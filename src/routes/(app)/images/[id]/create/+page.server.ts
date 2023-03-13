import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { containersManager } from '$lib/server/docker';

export const actions = {
	default: async ({ params, request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const command = data.get('command');
		const autoRestart = data.has('restart');
		if (!name || typeof name !== 'string') {
			return fail(400, { error: 'Invalid name' });
		}
		if (typeof command !== 'string') {
			return fail(400, { error: 'Invalid command' });
		}
		const res = await containersManager.createContainer(params.id, name, command, autoRestart);
		if (!res) {
			return fail(500, { error: 'Failed to create container' });
		}
		throw redirect(307, `/images/${params.id}/containers`);
	}
} satisfies Actions;
