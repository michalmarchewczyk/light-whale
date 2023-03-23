import type SitesManager from '$lib/server/sites/SitesManager';
import { logger } from '$lib/server/utils/Logger';
import type Site from '$lib/server/sites/Site';
import type NginxManager from '$lib/server/docker/NginxManager';
import { eventsController } from '$lib/server/events/EventsController';

export default class AdminSitesManager {
	constructor(private sitesManager: SitesManager, private nginxManager: NginxManager) {
		logger.logVerbose('AdminSitesManager initialized');
	}

	public async getAdminSites(): Promise<Site[]> {
		const sites = await this.sitesManager.getSites();
		return sites.filter((s) => s.data.containerId === 'host.docker.internal');
	}

	public async createSite(domain: string) {
		let port = parseInt(process.env.PORT ?? '0', 10);
		if (!port) {
			const foundPorts = await this.nginxManager.scanContainerPorts('host.docker.internal');
			const portsToScan = [
				3000,
				4173,
				5173,
				80,
				443,
				8080,
				...foundPorts.map((p) => parseInt(p.split(' ')[0], 10))
			];
			for (const p of portsToScan) {
				const res = await fetch(`http://localhost:${p}/api/ping`)
					.then((r) => r.text())
					.catch(() => '');
				if (res === 'Light-Whale') {
					port = p;
					break;
				}
			}
		}
		if (!port) {
			logger.logError('Could not determine port that Light-Whale is running on');
			eventsController.pushError(
				'Failed to create admin site',
				'Could not determine port that Light-Whale is running on'
			);
			return false;
		}
		return await this.sitesManager.createSite('host.docker.internal', domain, port);
	}
}
