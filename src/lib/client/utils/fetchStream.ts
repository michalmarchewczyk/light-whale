import { onMount } from 'svelte';

const fetchStream = (
	fetchUrl: string,
	onData: (data: string) => void,
	onStart?: () => void,
	block?: () => boolean
) => {
	let connected = false;
	let abortController = new AbortController();

	onMount(() => {
		const interval = setInterval(fetchData, 100);
		return () => {
			clearInterval(interval);
			abortController.abort();
		};
	});

	const textDecoder = new TextDecoder();

	const fetchData = () => {
		if (connected || block?.()) {
			return;
		}
		connected = true;
		abortController.abort();
		abortController = new AbortController();
		const writeStream = new WritableStream({
			start: () => {
				connected = true;
				onStart?.();
			},
			write: (chunk) => {
				connected = true;
				const chunkData = textDecoder.decode(chunk);
				onData(chunkData);
			},
			close: () => {
				connected = false;
			},
			abort: () => {
				connected = false;
			}
		});
		fetch(fetchUrl, { signal: abortController.signal })
			.then((res) => res.body)
			.then((body) => {
				if (!body) {
					return;
				}
				body.pipeTo(writeStream);
			})
			.catch(() => {
				connected = false;
			});
	};
};

export default fetchStream;
