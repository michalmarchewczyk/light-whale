import type { PageServerLoad } from './$types';
import { dockerhubProxy } from '$lib/server/sources/dockerhub';

export const load = (({ url }) => {
	const query = url.searchParams.get('search');
	return {
		results: {
			images: dockerhubProxy.search(query ?? '')
		}
	};
}) satisfies PageServerLoad;
