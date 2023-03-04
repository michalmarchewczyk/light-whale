import type SiteData from '$lib/server/sites/SiteData';
import type FilesManager from '$lib/server/utils/FilesManager';
import siteConfigTemplate from '$lib/server/templates/site.conf?raw';
import siteSslConfigTemplate from '$lib/server/templates/site-ssl.conf?raw';
import { logger } from '$lib/server/utils/Logger';
import type NginxManager from '$lib/server/docker/NginxManager';
import { eventsController } from '$lib/server/events/EventsController';

export default class Site {
	constructor(
		public id: string,
		public data: SiteData,
		private filesManager: FilesManager,
		private nginxManager: NginxManager
	) {
		this.saveFile();
	}

	public async pause() {
		logger.logInfo(`Pausing site ${this.id}`);
		this.data.paused = true;
		await this.saveFile();
	}

	public async unpause() {
		logger.logInfo(`Unpausing site ${this.id}`);
		this.data.paused = false;
		await this.saveFile();
	}

	public async enableSsl() {
		logger.logInfo(`Enabling SSL for site ${this.id}`);
		this.data.ssl = true;
		const generated = await this.nginxManager.generateSslCertificate(this.data.domain);
		if (!generated) {
			logger.logError(`Failed to enable SSL certificate for site ${this.id}`);
			eventsController.push({
				type: 'error',
				title: 'Failed to enable SSL',
				message: `Failed to generate SSL certificate for domain ${this.data.domain}`
			});
			this.data.ssl = false;
		}
		await this.saveFile();
	}

	public async disableSsl() {
		logger.logInfo(`Disabling SSL for site ${this.id}`);
		this.data.ssl = false;
		await this.saveFile();
	}

	private async saveFile() {
		let template = siteConfigTemplate;
		if (this.data.ssl) {
			template = siteSslConfigTemplate;
		}
		const newContent = template
			.replaceAll('[site_id]', this.id)
			.replaceAll('[container_id]', this.data.containerId.substring(0, 12))
			.replaceAll('[container_port]', this.data.containerPort.toString())
			.replaceAll('[domain]', this.data.domain)
			.replaceAll('[paused]', this.data.paused.toString())
			.replaceAll('[created]', this.data.created.toISOString());
		await this.filesManager.writeFile(`sites/site-${this.id}.conf`, newContent, true);
	}

	public async remove() {
		logger.logInfo(`Removing site ${this.id}`);
		await this.filesManager.removeFile(`sites/site-${this.id}.conf`);
	}
}
