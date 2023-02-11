import { writable } from 'svelte/store';
import type Event from '$lib/server/events/Event';

export const events = writable<Event[]>([]);

export const fetchEvents = async () => {
	const writeStream = new WritableStream({
		write: (chunk) => {
			const chunkStr = new TextDecoder().decode(chunk);
			const strings = chunkStr.split('\n').filter((str) => str);
			strings.forEach((str) => {
				const event = JSON.parse(str) as Event;
				events.update((events) => {
					events.push(event);
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
		return events.filter((event) => now - event.time < 1000 * 10);
	});
};

setInterval(filterOutOldEvents, 200);
