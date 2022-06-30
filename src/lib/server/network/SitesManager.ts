import type {Site} from '$lib/server/network/Site.interface';
import {logger, LogType} from '$lib/server/utils/Logger';
import fs from 'fs/promises';
import {nginxPath} from '$lib/server/setup/config';
import path from 'path';
import {EOL} from 'os';
import type NginxController from '$lib/server/network/NginxController';
import {connectToLWNetwork} from '$lib/server/docker/containers';
import crypto from 'crypto';
import template from '$lib/server/network/templates/template.conf?raw';

export default class SitesManager {
	constructor(private nginxController:NginxController) {}

	public async getSites():Promise<Site[]> {
		logger.log(LogType.Info, 'Listing sites');
		const fileNames = await fs.readdir(nginxPath);
		const sites:Site[] = [];
		for await (const fileName of fileNames) {
			const content = await fs.readFile(path.join(nginxPath, fileName), {encoding: 'utf8'});
			if(!SitesManager.isContentSiteConfig(content)){
				continue;
			}
			const lines = content.split(EOL);
			sites.push({
				id: lines[1].split(' ')[2].trim(),
				containerId: lines[2].split(' ')[2].trim(),
				domain: lines[3].split(' ')[2].trim(),
				paused: lines[4].split(' ')[2].trim() === 'true',
				created: new Date(lines[5].split(' ')[2].trim()),
			});
		}
		return sites;
	}

	private static isContentSiteConfig(content:string):boolean {
		return content.startsWith(`# light-whale${EOL}# site`);
	}

	private async getSiteContentLines(id:string):Promise<string[]> {
		const content = await fs.readFile(path.join(nginxPath, `site-${id}.conf`), {encoding: 'utf8'});
		if (!SitesManager.isContentSiteConfig(content)) {
			return [];
		}
		return content.split(EOL);
	}

	public async createSite(containerId:string, domain:string, port:number):Promise<boolean> {
		logger.log(LogType.Info, `Create site with containerId: ${containerId} and domain: ${domain}`);
		const sites = await this.getSites();
		if (sites.map(s => s.domain).includes(domain)) {
			return false;
		}
		await connectToLWNetwork(containerId);
		const newSite:Site = {
			id: crypto.randomBytes(6).toString('hex'),
			paused: false,
			created: new Date(),
			containerId,
			domain,
		};
		const newContent = template
			.replaceAll('[site_id]', newSite.id)
			.replaceAll('[container_id]', newSite.containerId.substring(0, 12))
			.replaceAll('[domain]', newSite.domain)
			.replaceAll('[created]', newSite.created.toISOString())
			.replaceAll('[port]', port.toString());
		await this.saveSiteContent(newSite.id, newContent);
		return true;
	}

	private async saveSiteContent(id:string, newContent) {
		await fs.writeFile(path.join(nginxPath, `site-${id}.conf`), newContent, {encoding: 'utf8'});
		await this.nginxController.reload();
	}

	public async removeSite(id:string):Promise<boolean> {
		logger.log(LogType.Info, `Remove site with id: ${id}`);
		const lines = await this.getSiteContentLines(id);
		if(lines.length < 1){
			return false;
		}
		await fs.rm(path.join(nginxPath, `site-${id}.conf`));
		await this.nginxController.reload();
		return true;
	}

	public async pauseSite(id:string):Promise<boolean> {
		logger.log(LogType.Info, `Pause site with id: ${id}`);
		const lines = await this.getSiteContentLines(id);
		if(lines.length < 1){
			return false;
		}
		lines[4] = '# paused: true';
		for (let i = 6; i < lines.length; i++) {
			lines[i] = '# ' + lines[i];
		}
		const newContent = lines.join(EOL);
		await this.saveSiteContent(id, newContent);
		return true;
	}

	public async unpauseSite(id:string):Promise<boolean> {
		logger.log(LogType.Info, `Unpause site with id: ${id}`);
		const lines = await this.getSiteContentLines(id);
		if(lines.length < 1){
			return false;
		}
		lines[4] = '# paused: false';
		for (let i = 6; i < lines.length; i++) {
			lines[i] = lines[i].substring(2);
		}
		const newContent = lines.join(EOL);
		await this.saveSiteContent(id, newContent);
		return true;
	}
}
