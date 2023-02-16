import type FilesManager from '$lib/server/utils/FilesManager';
import Site from '$lib/server/sites/Site';
import { logger } from '$lib/server/utils/Logger';
import { EOL } from 'os';
import type SiteData from '$lib/server/sites/SiteData';

export default class SitesManager {
	private sites: Site[] = [];

	constructor(private filesManager: FilesManager) {
		logger.logVerbose('SitesManager initialized');
	}

	public async getSites(): Promise<Site[]> {
		const files = await this.filesManager.readDirFiles('sites/');
		const siteFiles = files.filter((file) => this.isContentSiteConfig(file));
		const sitesData = siteFiles.map((file) => this.parseSiteData(file));
		this.sites = sitesData.map((data) => this.createSiteFromData(data));
		return this.sites;
	}

	public async getSitesData(): Promise<SiteData[]> {
		const sites = await this.getSites();
		return sites.map((s) => s.data);
	}

	private isContentSiteConfig(content: string): boolean {
		return content.startsWith('# Light-Whale site config');
	}

	private parseSiteData(content: string): SiteData {
		const lines = content.split(EOL);
		return {
			id: lines[1].split(' ')[2].trim(),
			containerId: lines[2].split(' ')[2].trim(),
			containerPort: parseInt(lines[3].split(' ')[2].trim(), 10),
			domain: lines[4].split(' ')[2].trim(),
			paused: lines[5].split(' ')[2].trim() === 'true',
			created: new Date(lines[6].split(' ')[2].trim())
		};
	}

	private createSiteFromData(data: SiteData): Site {
		return new Site(data.id, data, this.filesManager);
	}

	public async getSiteByDomain(domain: string): Promise<Site | undefined> {
		if (!this.sites.find((s) => s.data.domain === domain)) {
			await this.getSites();
		}
		return this.sites.find((s) => s.data.domain === domain);
	}

	public async removeSite(site: Site): Promise<void> {
		await site.remove();
		this.sites = this.sites.filter((s) => s.id !== site.id);
	}
}
