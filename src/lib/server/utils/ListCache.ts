export default class ListCache<T> {
	private cached: Record<string, T> = {};

	constructor(private readonly fetchFunction: (key: string) => T | Promise<T>) {}

	public async prefetch(keys: string[]) {
		keys.forEach((key) => {
			this.fetch(key);
		});
	}

	public async get(key: string) {
		if (this.cached[key]) {
			return this.cached[key];
		}
		return this.fetch(key);
	}

	private async fetch(key: string) {
		this.cached[key] = await this.fetchFunction(key);
		return this.cached[key];
	}
}
