import type {RequestHandler} from '@sveltejs/kit';
import {execCommand} from '$lib/docker/exec';
import {checkSession} from '$lib/auth/sessions';
import validator from 'validator';

const get:RequestHandler = async ({url, headers}) => {
	if (!checkSession(headers)) {
		return {
			status: 401,
		};
	}
	const id = url.searchParams.get('id') ?? '';
	const path = url.searchParams.get('path') ?? '';
	if (!id) {
		return {
			status: 400
		};
	}
	if (!validator.isAlphanumeric(id) || !validator.isURL(path, {
		require_valid_protocol: false,
		require_host: false,
	})) {
		return {
			status: 400,
		};
	}
	const data = await execCommand(id, `ls -lha --time-style=full-iso --group-directories-first ${path}`);
	if (!data) {
		return {
			status: 400,
		};
	}
	const lines = data.split('\r\n');
	if (!lines[0].startsWith('total')) {
		return {
			status: 400
		};
	}
	const res = [];
	lines.slice(1).forEach(line => {
		const fileData = line.split(/[ ]+/);
		if (fileData.length < 9) return;
		if (!fileData[0].startsWith('d') && !fileData[0].startsWith('l') && !fileData[0].startsWith('-')) return;
		res.push({
			directory: fileData[0].substring(0, 1) === 'd',
			symlink: fileData[0].substring(0, 1) === 'l',
			name: fileData[8],
			size: fileData[4],
			date: fileData[5],
			other: fileData
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
