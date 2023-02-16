import type SiteData from '$lib/server/sites/SiteData';
import type FilesManager from '$lib/server/utils/FilesManager';
import siteConfigTemplate from '$lib/server/templates/site.conf?raw';

export default class Site {
	constructor(public id: string, public data: SiteData, private filesManager: FilesManager) {
		this.saveFile();
	}

	public async pause() {
		this.data.paused = true;
		await this.saveFile();
	}

	public async unpause() {
		this.data.paused = false;
		await this.saveFile();
	}

	private async saveFile() {
		const newContent = siteConfigTemplate
			.replaceAll('[site_id]', this.id)
			.replaceAll('[container_id]', this.data.containerId.substring(0, 12))
			.replaceAll('[container_port]', this.data.containerPort.toString())
			.replaceAll('[domain]', this.data.domain)
			.replaceAll('[paused]', this.data.paused.toString())
			.replaceAll('[created]', this.data.created.toISOString());
		await this.filesManager.writeFile(`sites/site-${this.id}.conf`, newContent, true);
	}

	public async remove() {
		await this.filesManager.removeFile(`sites/site-${this.id}.conf`);
	}
}
