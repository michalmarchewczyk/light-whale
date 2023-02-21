import type { PageServerLoad } from './$types';
import { dockerhubProxy } from '$lib/server/sources/dockerhub';

export const load = (async ({ url }) => {
	const query = url.searchParams.get('search');
	const images = await dockerhubProxy.search(query ?? '');
	return {
		images: images
	};
}) satisfies PageServerLoad;
