import { writable } from 'svelte/store';
import type Status from '$lib/server/status/Status';

export const status = writable<Status | null>(null);

export const fetchStatus = async () => {
	const writeStream = new WritableStream({
		write: (chunk) => {
			const chunkStr = new TextDecoder().decode(chunk);
			const strings = chunkStr.split('\n').filter((str) => str);
			strings.forEach((str) => {
				status.set(JSON.parse(str) as Status);
			});
		}
	});
	fetch('/api/status')
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
