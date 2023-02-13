import type { LayoutServerLoad } from './$types';
import { containersManager } from '$lib/server/docker';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	let container = await containersManager.getContainer(params.id);
	if (!container) {
		container = await containersManager.getContainerByName(params.id);
	}
	if (!container) {
		throw redirect(307, '/containers');
	}
	return {
		container: container?.data
	};
}) satisfies LayoutServerLoad;
