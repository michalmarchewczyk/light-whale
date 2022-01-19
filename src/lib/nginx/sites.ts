import fs from 'fs/promises';
import path from 'path';

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

export const getSites = async ():Promise<Site[]> => {
	const fileNames = await fs.readdir(nginxPath);
	const files:SiteConfig[] = [];
	for await (const fileName of fileNames) {
		const content = await fs.readFile(path.join(nginxPath, fileName), {encoding: 'utf8'});
		if (!content.startsWith('# light-whale')) {
			continue;
		}
		const lines = content.split('\r\n');
		if (!lines[1].startsWith('# site')) {
			continue;
		}
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

