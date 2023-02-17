import type { PageServerLoad } from './$types';
import { gitServicesController } from '$lib/server/sources/git';

export const load = (async () => {
	const remoteRepos = await gitServicesController.listAllRepos();
	return {
		remoteRepos
	};
}) satisfies PageServerLoad;
