import {execCommand} from '$lib/server/docker/exec';
import {EOL} from 'os';

interface File {
	directory: boolean;
	symlink: boolean;
	name: string;
	size: string;
	date: string;
	other: string[];
}

export async function getContainerFile(id:string, path:string):Promise<string> {
	return await execCommand(id, `cat ${path}`);
}

export async function getContainerFiles(id:string, path:string):Promise<File[]> {
	const data = await execCommand(id, `ls -lha --time-style=full-iso --group-directories-first ${path}`);
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
