import type {RequestHandler} from '@sveltejs/kit';
import {execCommand} from '$lib/docker/exec';


const get:RequestHandler = async ({query}) => {
	const id = query.get('id');
	const path = query.get('path');
	if (!id) {
		return {
			status: 400
		};
	}
	const data = await execCommand(id, `ls -lha --time-style=full-iso --group-directories-first ${path}`);
	if(!data) {
		return {
			status: 400,
		};
	}
	const lines = data.split('\r\n');
	if(!lines[0].startsWith('total')){
		return {
			status: 400
		};
	}
	const res = [];
	lines.slice(1).forEach(line => {
		const fileData = line.split(/[ ]+/);
		if(fileData.length < 9) return;
		res.push({
			directory: fileData[0].substring(0,1) === 'd',
			symlink: fileData[0].substring(0,1) === 'l',
			name: fileData[8],
			size: fileData[4],
			date: fileData[5],
		});
	});
	return {
		status: 200,
		body: res,
	};
};

export {
	get
};
