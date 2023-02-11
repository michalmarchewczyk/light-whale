import type { RequestHandler } from '@sveltejs/kit';
import { eventsController } from '$lib/server/events/EventsController';

export const GET = (() => {
	return new Response(eventsController.getReadableStream(), {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}) satisfies RequestHandler;
