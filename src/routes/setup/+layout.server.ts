import { redirect } from '@sveltejs/kit';
import { setupController } from '$lib/server/setup';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	if (await setupController.checkSetup()) {
		throw redirect(307, '/');
	}
}) satisfies LayoutServerLoad;
