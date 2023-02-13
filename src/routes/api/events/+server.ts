import type { RequestHandler } from '@sveltejs/kit';
import { eventsController } from '$lib/server/events/EventsController';
import { sessionManager } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

export const GET = (({ cookies }) => {
	const sessionId = cookies.get('sessionId');
	if (!sessionId || !sessionManager.checkSession(sessionId)) {
		throw error(401, 'Unauthorized');
	}
	return new Response(eventsController.getReadableStream(), {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}) satisfies RequestHandler;
