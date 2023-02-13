export const createDebouncer = (fn: (...args: unknown[]) => void, delay: number) => {
	let timeout: NodeJS.Timeout;
	return (...args: unknown[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
};
