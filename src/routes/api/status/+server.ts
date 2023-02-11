import type { RequestHandler } from '@sveltejs/kit';
import { statusController } from '$lib/server/status';

export const GET = (() => {
	return new Response(statusController.getReadableStream(), {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
}) satisfies RequestHandler;
