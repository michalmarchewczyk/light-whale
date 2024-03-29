import type FilesManager from '$lib/server/utils/FilesManager';
import Site from '$lib/server/sites/Site';
import { logger } from '$lib/server/utils/Logger';
import { EOL } from 'os';
import type SiteData from '$lib/server/sites/SiteData';
import crypto from 'crypto';
import type IpSettingsController from '$lib/server/dns/IpSettingsController';
import type DnsProvidersController from '$lib/server/dns/DnsProvidersController';
import type NginxManager from '$lib/server/docker/NginxManager';
import { eventsController } from '$lib/server/events/EventsController';

export default class SitesManager {
	private sites: Site[] = [];

	constructor(
		private filesManager: FilesManager,
		private dnsProvidersController: DnsProvidersController,
		private ipSettingsController: IpSettingsController,
		private nginxManager: NginxManager
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
		return sites.map((s) => s.data).filter((s) => s.containerId !== 'host.docker.internal');
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
			created: new Date(lines[6].split(' ')[2].trim()),
			ssl: lines[7].split(' ')[2].trim() === 'true'
		};
	}

	private createSiteFromData(data: SiteData): Site {
		return new Site(data.id, data, this.filesManager, this.nginxManager);
	}

	public async getSiteByDomain(domain: string): Promise<Site | undefined> {
		if (!this.sites.find((s) => s.data.domain === domain)) {
			await this.getSites();
		}
		return this.sites.find((s) => s.data.domain === domain);
	}

	public async removeSite(site: Site): Promise<void> {
		eventsController.pushInfo('Removing site', `Removing site with domain ${site.data.domain}`);
		if (this.ipSettingsController.isAutoAdd()) {
			const addresses = [
				...this.ipSettingsController.listV4Addresses(),
				...this.ipSettingsController.listV6Addresses()
			];
			await Promise.all(
				addresses.map((address) =>
					this.dnsProvidersController.deleteRecordByDomainAndAddress(site.data.domain, address)
				)
			);
		}
		await site.remove();
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
		eventsController.pushInfo('Creating site', `Creating site with domain ${domain}`);
		const siteData: SiteData = {
			id: this.generateSiteId(),
			containerId,
			containerPort: port,
			domain,
			paused: false,
			created: new Date(),
			ssl: false
		};
		const site = new Site(siteData.id, siteData, this.filesManager, this.nginxManager);
		this.sites.push(site);
		if (this.ipSettingsController.isAutoAdd()) {
			const addresses = [
				...this.ipSettingsController.listV4Addresses(),
				...this.ipSettingsController.listV6Addresses()
			];
			await Promise.all(
				addresses.map((address) => this.dnsProvidersController.createRecord(domain, address))
			);
		}
		eventsController.pushSuccess('Site created', `Site with domain ${domain} created`);
		return true;
	}

	private generateSiteId(): string {
		return crypto.randomBytes(6).toString('hex');
	}
}
