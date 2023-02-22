import type { RequestHandler } from '@sveltejs/kit';
import { sessionManager } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { processesManager } from '$lib/server/processes';

export const GET = (({ params, cookies }) => {
	const sessionId = cookies.get('sessionId');
	if (!sessionId || !sessionManager.checkSession(sessionId)) {
		throw error(401, 'Unauthorized');
	}
	if (!params.id) {
		throw error(400, 'Bad request');
	}
	const processStream = processesManager.getReadableStream(params.id);
	return new Response(processStream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}) satisfies RequestHandler;
