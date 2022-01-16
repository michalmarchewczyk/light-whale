import fs from 'fs/promises';
import path from 'path';

export interface Site {
	id:string,
	containerId:string,
	domain:string,
}

export interface SiteConfig {
	site:Site,
	content:string,
}

const nginxPath = process.env.NGINX_PATH ?? path.join(process.cwd(), 'nginx-config');

export const getSites = async ():Promise<Site[]> => {
	const fileNames = await fs.readdir(nginxPath);
	const files:SiteConfig[] = [];
	for await (const fileName of fileNames){
		const content = await fs.readFile(path.join(nginxPath, fileName), {encoding: 'utf8'});
		if(!content.startsWith('# docker-control-panel')){
			continue;
		}
		const lines = content.split('\r\n');
		files.push({
			site: {
				id: lines[1].split(':')[1].trim(),
				containerId: lines[2].split(':')[1].trim(),
				domain: lines[3].split(':')[1].trim(),
			},
			content: content,
		});
	}
	return files.map(file => file.site);
};

