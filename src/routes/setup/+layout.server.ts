import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { authController } from '$lib/server/auth';

export const load = (async () => {
	if (await authController.checkPasswordSet()) {
		throw redirect(307, '/');
	}
}) satisfies LayoutServerLoad;
