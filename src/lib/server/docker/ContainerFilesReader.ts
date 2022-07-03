import type Container from '$lib/server/docker/Container';
import type {File} from '$lib/server/docker/File.interface';
import {logger, LogType} from '$lib/server/utils/Logger';
import {EOL} from 'os';

export default class ContainerFilesReader {
	private async getContainerFiles(container: Container, path:string): Promise<File[]> {
		const data = await container.exec(`ls -lha --time-style=full-iso --group-directories-first ${path}`);
		if (!data) {
			return [];
		}
		const lines = data.split(EOL);
		if (!lines[0].startsWith('total')) {
			return [];
		}
		const res:File[] = [];
		lines.slice(1).forEach(line => {
			const fileData = line.split(/[ ]+/);
			if (fileData.length < 9) {
				return;
			}
			if (!fileData[0].startsWith('d') && !fileData[0].startsWith('l') && !fileData[0].startsWith('-')) {
				return;
			}
			res.push({
				directory: fileData[0].substring(0, 1) === 'd',
				symlink: fileData[0].substring(0, 1) === 'l',
				name: fileData[8],
				size: fileData[4],
				date: fileData[5],
				other: fileData,
			});
		});
		return res;
	}

	public async readPath(container:Container, path:string):Promise<File[] | string> {
		logger.log(LogType.Info, `Read path: ${path} from container with id: ${container.id}`);
		const catRes = await container.exec(`cat ${path}`);
		if (catRes && catRes.trim() !== `cat: ${path}: Is a directory`) {
			logger.log(LogType.Info, `Read file: ${path} from container with id: ${container.id}`);
			return catRes;
		}
		logger.log(LogType.Info, `Read folder: ${path} from container with id: ${container.id}`);
		return await this.getContainerFiles(container, path);
	}
}
