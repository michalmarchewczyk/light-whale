import { DOCKER_URL } from '$lib/server/config';
import type { EventMessage } from '$lib/server/types/docker/api';
import DockerEventsParser from '$lib/server/events/DockerEventsParser';
import type Event from '$lib/server/events/Event';
import { logger } from '$lib/server/utils/Logger';

const FILTER_DOCKER_EVENTS = {
	event: [
		'create',
		'remove',
		'delete',
		'update',
		'prune',
		'reload',
		'destroy',
		'pull',
		'import',
		'load',
		'pause',
		'unpause',
		'start',
		'stop',
		'restart',
		'kill'
	]
};

class EventsController {
	private static instance: EventsController;
	private controllers: ReadableStreamDefaultController[] = [];
	private dockerEventsParser: DockerEventsParser = new DockerEventsParser();
	private idCounter = 1;

	public static getInstance() {
		if (!EventsController.instance) {
			EventsController.instance = new EventsController();
		}
		return EventsController.instance;
	}

	private constructor() {
		logger.logVerbose('EventsController initialized');
		this.listenToDockerEvents();
	}

	private generateId(): number {
		return this.idCounter++;
	}

	async listenToDockerEvents() {
		const writeStream = new WritableStream({
			write: (chunk) => {
				try {
					const dockerEvent: EventMessage = JSON.parse(new TextDecoder().decode(chunk));
					const parsedEvent = this.dockerEventsParser.parseEvent(dockerEvent);
					logger.logVerbose(`Docker event: ${parsedEvent.title} - ${parsedEvent.message}`);
					this.push(parsedEvent);
				} catch (err) {
					// ignore
				}
			}
		});
		try {
			const res = await fetch(
				`${DOCKER_URL}/events?filters=${JSON.stringify(FILTER_DOCKER_EVENTS)}`
			);
			if (!res.body) {
				return;
			}
			await res.body.pipeTo(writeStream);
		} catch (err) {
			await new Promise((resolve) => setTimeout(resolve, 10));
			await this.listenToDockerEvents();
		}
	}

	push(event: Omit<Omit<Event, 'id'>, 'time'>): void {
		this.controllers.forEach((controller) => {
			controller.enqueue(
				JSON.stringify({ ...event, id: this.generateId(), time: Date.now() }) + '\n'
			);
		});
	}

	getReadableStream() {
		let savedController: ReadableStreamDefaultController;
		return new ReadableStream({
			start: (controller) => {
				savedController = controller;
				this.controllers.push(controller);
			},
			cancel: () => {
				this.controllers = this.controllers.filter((c) => c !== savedController);
			}
		});
	}
}

export const eventsController = EventsController.getInstance();
