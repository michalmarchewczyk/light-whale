import { writable } from 'svelte/store';
import type Event from '$lib/server/events/Event';
import { createDebouncer } from '$lib/client/utils/debounce';
import { invalidate } from '$app/navigation';

export const events = writable<Event[]>([]);

const refreshDebounce = createDebouncer(async () => {
	await invalidate('app:docker');
}, 500);

export const fetchEvents = async () => {
	const writeStream = new WritableStream({
		write: (chunk) => {
			const chunkStr = new TextDecoder().decode(chunk);
			const strings = chunkStr.split('\n').filter((str) => str);
			strings.forEach((str) => {
				const event = JSON.parse(str) as Event;
				events.update((events) => {
					events.push(event);
					refreshDebounce();
					return events;
				});
			});
		}
	});
	fetch('/api/events')
		.then((res) => res.body)
		.then((body) => {
			if (!body) {
				return;
			}
			body.pipeTo(writeStream);
		})
		.catch(() => {
			//ignore
		});
};

const filterOutOldEvents = () => {
	const now = Date.now();
	events.update((events) => {
		return events.filter((event) => now - event.time < 1000 * 5);
	});
};

export const removeEvent = (event: Event) => {
	events.update((events) => {
		return events.filter((e) => e !== event);
	});
};

export const clearEvents = () => {
	events.set([]);
};

setInterval(filterOutOldEvents, 200);
