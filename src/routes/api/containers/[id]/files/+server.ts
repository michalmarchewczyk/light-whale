import type { RequestHandler } from '@sveltejs/kit';
import { sessionManager } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { containerFilesReader, containersManager } from '$lib/server/docker';
import validator from 'validator';

export const GET = (async ({ cookies, params, url }) => {
	const sessionId = cookies.get('sessionId');
	if (!sessionId || !sessionManager.checkSession(sessionId)) {
		throw error(401, 'Unauthorized');
	}
	if (!params.id) {
		throw error(400, 'Bad request');
	}
	const container = await containersManager.findContainer(params.id);
	if (!container) {
		throw error(404, 'Not found');
	}
	const path = url.searchParams.get('path') ?? '';
	if (
		!validator.isAlphanumeric(params.id) ||
		!validator.isURL(path, {
			require_valid_protocol: false,
			require_host: false
		})
	) {
		throw error(400, 'Bad request');
	}
	const data = await containerFilesReader.readPath(container, path);
	if (typeof data === 'string') {
		return new Response(JSON.stringify({ type: 'file', data }));
	} else {
		return new Response(JSON.stringify({ type: 'folder', data }));
	}
}) satisfies RequestHandler;
