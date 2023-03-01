import type FilesManager from '$lib/server/utils/FilesManager';
import Site from '$lib/server/sites/Site';
import { logger } from '$lib/server/utils/Logger';
import { EOL } from 'os';
import type SiteData from '$lib/server/sites/SiteData';
import crypto from 'crypto';
import type IpSettingsController from '$lib/server/dns/IpSettingsController';
import type DnsProvidersController from '$lib/server/dns/DnsProvidersController';

export default class SitesManager {
	private sites: Site[] = [];

	constructor(
		private filesManager: FilesManager,
		private dnsProvidersController: DnsProvidersController,
		private ipSettingsController: IpSettingsController
	) {
		logger.logVerbose('SitesManager initialized');
	}

	public async getSites(): Promise<Site[]> {
		logger.logVerbose('Listing sites');
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
		await this.dnsProvidersController.deleteRecords(site.data.domain);
		this.sites = this.sites.filter((s) => s.id !== site.id);
	}

	public async getSitesByContainerId(containerId: string): Promise<Site[]> {
		await this.getSites();
		return this.sites.filter((s) => containerId.startsWith(s.data.containerId));
	}

	public async createSite(containerId: string, domain: string, port: number) {
		if (await this.getSiteByDomain(domain)) {
			return false;
		}
		logger.logInfo(
			`Creating site for container ${containerId} on port ${port} with domain ${domain}`
		);
		const siteData: SiteData = {
			id: this.generateSiteId(),
			containerId,
			containerPort: port,
			domain,
			paused: false,
			created: new Date()
		};
		const site = new Site(siteData.id, siteData, this.filesManager);
		this.sites.push(site);
		if (this.ipSettingsController.isAutoAdd()) {
			const addresses = [
				...this.ipSettingsController.listV4Addresses(),
				...this.ipSettingsController.listV6Addresses()
			];
			for (const address of addresses) {
				await this.dnsProvidersController.createRecord(domain, address);
			}
		}
		return true;
	}

	private generateSiteId(): string {
		return crypto.randomBytes(6).toString('hex');
	}
}
