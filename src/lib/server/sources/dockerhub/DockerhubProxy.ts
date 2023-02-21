import ListCache from '$lib/server/utils/ListCache';
import { logger } from '$lib/server/utils/Logger';

export default class DockerhubProxy {
	private cache: ListCache<unknown[]> = new ListCache<unknown[]>(this.searchFetch);

	constructor() {
		logger.logVerbose('DockerhubProxy initialized');
	}

	private async searchFetch(query: string) {
		const res = await fetch(
			`https://hub.docker.com/api/content/v1/products/search?page_size=50&q=${query}
	&type=image`,
			{
				method: 'GET',
				headers: { 'Search-Version': 'v3' }
			}
		);
		const data = await res.json();
		return data.summaries?.length > 0 ? data.summaries : [];
	}

	public async search(query: string) {
		logger.logVerbose(`Searching Dockerhub for ${query}`);
		return await this.cache.get(query);
	}

	public async getTags(image: string) {
		logger.logVerbose(`Getting Dockerhub tags for ${image}`);
		image = image.includes('/') ? image : 'library/' + image;
		const res = await fetch(
			`https://hub.docker.com/v2/repositories/${image}/tags/?page_size=100&page=1`,
			{
				method: 'GET'
			}
		);
		if (res.status !== 200) {
			return [];
		}
		const data = await res.json();
		return data.results?.length > 0 ? data.results : [];
	}
}
