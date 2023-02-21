import type { RequestHandler } from '@sveltejs/kit';
import { dockerhubProxy } from '$lib/server/sources/dockerhub';

export const GET = (async ({ url }) => {
	const image = url.searchParams.get('image');
	if (!image) {
		return new Response(JSON.stringify({ error: 'Invalid image' }), { status: 400 });
	}
	const tags = await dockerhubProxy.getTags(image);
	return new Response(JSON.stringify(tags));
}) satisfies RequestHandler;
