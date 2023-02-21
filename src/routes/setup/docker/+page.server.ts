import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { statusController } from '$lib/server/status';

export const load = (async ({ depends }) => {
	depends('setup:docker');
	const { dockerPing, dockerRunning } = await statusController.getCurrentStatus();
	if (dockerPing) {
		throw redirect(307, '/setup/nginx');
	}
	return {
		dockerRunning,
		dockerPing
	};
}) satisfies PageServerLoad;
