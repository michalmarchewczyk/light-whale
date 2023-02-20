import type { RequestHandler } from '@sveltejs/kit';
import { sessionManager } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { logger } from '$lib/server/utils/Logger';

export const GET = (async ({ cookies }) => {
	const sessionId = cookies.get('sessionId');
	if (!sessionId || !sessionManager.checkSession(sessionId)) {
		throw error(401, 'Unauthorized');
	}
	return new Response(await logger.getReadableStream(), {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}) satisfies RequestHandler;
