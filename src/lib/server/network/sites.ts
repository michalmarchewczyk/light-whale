import fs from 'fs/promises';
import path from 'path';
import {reloadNginx} from '$lib/server/network/nginx';
import template from './template.conf?raw';
import crypto from 'crypto';
import {connectToLWNetwork} from '$lib/server/docker/containers';
import {EOL} from 'os';

export interface Site {
	id:string,
	containerId:string,
	domain:string,
	paused:boolean,
	created:Date,
}

export interface SiteConfig {
	site:Site,
	content:string,
}

const nginxPath = process.env.NGINX_PATH ?? path.join(process.cwd(), 'nginx-config');

const isContentSiteConfig = (content:string):boolean => {
	return content.startsWith(`# light-whale${EOL}# site`);
};

export const getSites = async ():Promise<Site[]> => {
	const fileNames = await fs.readdir(nginxPath);
	const files:SiteConfig[] = [];
	for await (const fileName of fileNames) {
		const content = await fs.readFile(path.join(nginxPath, fileName), {encoding: 'utf8'});
		if (isContentSiteConfig(content)) {
			const lines = content.split(EOL);
			files.push({
				site: {
					id: lines[1].split(' ')[2].trim(),
					containerId: lines[2].split(' ')[2].trim(),
					domain: lines[3].split(' ')[2].trim(),
					paused: lines[4].split(' ')[2].trim() === 'true',
					created: new Date(lines[5].split(' ')[2].trim()),
				},
				content,
			});
		}
	}
	return files.map(file => file.site);
};


export const unpauseSite = async (id:string):Promise<boolean> => {
	const content = await fs.readFile(path.join(nginxPath, `site-${id}.conf`), {encoding: 'utf8'});
	if (!isContentSiteConfig(content)) {
		return false;
	}
	const lines = content.split(EOL);

	lines[4] = '# paused: false';
	for (let i = 6; i < lines.length; i++) {
		lines[i] = lines[i].substring(2);
	}

	const newContent = lines.join(EOL);
	await fs.writeFile(path.join(nginxPath, `site-${id}.conf`), newContent, {encoding: 'utf8'});

	await reloadNginx();
	return true;
};

export const pauseSite = async (id:string):Promise<boolean> => {
	const content = await fs.readFile(path.join(nginxPath, `site-${id}.conf`), {encoding: 'utf8'});
	if (!isContentSiteConfig(content)) {
		return false;
	}
	const lines = content.split(EOL);

	lines[4] = '# paused: true';
	for (let i = 6; i < lines.length; i++) {
		lines[i] = '# ' + lines[i];
	}

	const newContent = lines.join(EOL);
	await fs.writeFile(path.join(nginxPath, `site-${id}.conf`), newContent, {encoding: 'utf8'});

	await reloadNginx();
	return true;
};


export const removeSite = async (id:string):Promise<boolean> => {
	const content = await fs.readFile(path.join(nginxPath, `site-${id}.conf`), {encoding: 'utf8'});
	if (!isContentSiteConfig(content)) {
		return false;
	}

	await fs.rm(path.join(nginxPath, `site-${id}.conf`));

	await reloadNginx();
	return true;
};

export const createSite = async (containerId:string, domain:string, port:number):Promise<boolean> => {
	const sites = await getSites();
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

	await fs.writeFile(path.join(nginxPath, `site-${newSite.id}.conf`), newContent, {encoding: 'utf8'});

	await reloadNginx();
	return true;
};
