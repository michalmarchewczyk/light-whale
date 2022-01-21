import fs from 'fs/promises';
import path from 'path';
import {reloadNginx} from '$lib/network/nginx';

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
	return content.startsWith('# light-whale\r\n# site');
};

export const getSites = async ():Promise<Site[]> => {
	const fileNames = await fs.readdir(nginxPath);
	const files:SiteConfig[] = [];
	for await (const fileName of fileNames) {
		const content = await fs.readFile(path.join(nginxPath, fileName), {encoding: 'utf8'});
		if (!isContentSiteConfig(content)){
			continue;
		}
		const lines = content.split('\r\n');
		files.push({
			site: {
				id: lines[1].split(' ')[2].trim(),
				containerId: lines[2].split(' ')[2].trim(),
				domain: lines[3].split(' ')[2].trim(),
				paused: lines[4].split(' ')[2].trim() === 'true',
				created: new Date(lines[5].split(' ')[2].trim()),
			},
			content: content,
		});
	}
	return files.map(file => file.site);
};


export const unpauseSite = async (id:string):Promise<boolean> => {
	const content = await fs.readFile(path.join(nginxPath, 'site-'+id+'.conf'), {encoding: 'utf8'});
	if (!isContentSiteConfig(content)){
		return false;
	}
	const lines = content.split('\r\n');

	lines[4] = '# paused: false';
	for(let i = 6; i < lines.length; i++){
		lines[i] = lines[i].substring(2);
	}

	const newContent = lines.join('\r\n');
	await fs.writeFile(path.join(nginxPath, 'site-'+id+'.conf'), newContent, {encoding: 'utf8'});

	await reloadNginx();
	return true;
};

export const pauseSite = async (id:string):Promise<boolean> => {
	const content = await fs.readFile(path.join(nginxPath, 'site-'+id+'.conf'), {encoding: 'utf8'});
	if (!isContentSiteConfig(content)){
		return false;
	}
	const lines = content.split('\r\n');

	lines[4] = '# paused: true';
	for(let i = 6; i < lines.length; i++){
		lines[i] = '# ' + lines[i];
	}

	const newContent = lines.join('\r\n');
	await fs.writeFile(path.join(nginxPath, 'site-'+id+'.conf'), newContent, {encoding: 'utf8'});

	await reloadNginx();
	return true;
};
