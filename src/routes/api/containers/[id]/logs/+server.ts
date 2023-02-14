import type { RequestHandler } from '@sveltejs/kit';
import { sessionManager } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { containersManager } from '$lib/server/docker';

export const GET = (async ({ cookies, params }) => {
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
	return new Response(await container.getLogsStream(), {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}) satisfies RequestHandler;
